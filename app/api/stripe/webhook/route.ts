import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { releaseOrderReservations, consumeOrderReservations } from '@/lib/orders/inventory';
import { verifyStripeSignature } from '@/lib/payments/stripe.mjs';

type StripeEvent = {
  type?: string;
  data?: {
    object?: {
      id?: string;
      amount_total?: number;
      currency?: string;
      livemode?: boolean;
      payment_status?: string;
      metadata?: { paymentId?: string; orderId?: string };
    };
  };
};

async function releaseUnpaidOrder(paymentId: string, sessionId: string, orderId: string) {
  await prisma.$transaction(async (transaction) => {
    const payment = await transaction.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        orderId: true,
        provider: true,
        status: true,
        providerReference: true,
        order: { select: { status: true } },
      },
    });
    if (!payment || payment.orderId !== orderId || payment.provider !== 'STRIPE' || payment.status !== 'PENDING') return;
    if (payment.order.status !== 'PENDING') return;
    if (payment.providerReference && payment.providerReference !== sessionId) {
      throw new Error('Stripe session reference did not match the pending payment.');
    }

    const changed = await transaction.payment.updateMany({
      where: { id: paymentId, status: 'PENDING' },
      data: { status: 'FAILED', providerReference: sessionId },
    });
    if (changed.count !== 1) return;

    await transaction.paymentAttempt.updateMany({
      where: { paymentId, status: 'PENDING' },
      data: { status: 'FAILED', providerReference: sessionId, errorCode: 'SESSION_EXPIRED' },
    });
    await releaseOrderReservations(transaction, orderId);
    await transaction.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
    await transaction.orderStatusHistory.create({
      data: { orderId, status: 'CANCELLED', note: 'Stripe checkout session expired before payment.' },
    });
  });
}

async function markOrderPaid(paymentId: string, sessionId: string, orderId: string, amountTotal: number) {
  await prisma.$transaction(async (transaction) => {
    const payment = await transaction.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        orderId: true,
        provider: true,
        amount: true,
        currency: true,
        status: true,
        providerReference: true,
      },
    });
    if (!payment || payment.orderId !== orderId || payment.provider !== 'STRIPE'
      || payment.currency !== 'USD' || !payment.amount.mul(100).isEqualTo(amountTotal)) {
      throw new Error('Stripe event does not match the pending payment record.');
    }
    if (payment.providerReference && payment.providerReference !== sessionId) {
      throw new Error('Stripe session reference did not match the payment record.');
    }
    if (payment.status === 'COMPLETED') return;
    if (payment.status !== 'PENDING') throw new Error('Stripe event arrived for a non-pending payment.');

    const changed = await transaction.payment.updateMany({
      where: { id: paymentId, status: 'PENDING' },
      data: { status: 'COMPLETED', paidAt: new Date(), providerReference: sessionId },
    });
    if (changed.count !== 1) return;

    const updatedOrder = await transaction.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'CONFIRMED' },
    });
    if (updatedOrder.count !== 1) throw new Error('Stripe payment is valid but the order is no longer pending.');

    await transaction.paymentAttempt.updateMany({
      where: { paymentId, status: 'PENDING' },
      data: { status: 'SUCCEEDED', providerReference: sessionId },
    });
    await consumeOrderReservations(transaction, orderId);
    await transaction.orderStatusHistory.create({
      data: { orderId, status: 'CONFIRMED', note: 'Stripe payment confirmed by a verified webhook.' },
    });
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook Stripe غير مهيأ.' }, { status: 503 });

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!verifyStripeSignature(payload, signature, secret)) {
    return NextResponse.json({ error: 'توقيع webhook غير صالح.' }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json({ error: 'محتوى webhook غير صالح.' }, { status: 400 });
  }

  const session = event.data?.object;
  if (!session?.id || !session.metadata?.paymentId || !session.metadata.orderId) {
    return NextResponse.json({ error: 'بيانات جلسة الدفع غير مكتملة.' }, { status: 400 });
  }
  if (session.livemode !== false) {
    console.error('Rejected non-test Stripe webhook for sandbox checkout.');
    return NextResponse.json({ error: 'جلسات الدفع الحية غير مدعومة.' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      if (session.payment_status !== 'paid' || session.currency?.toLowerCase() !== 'usd'
        || !Number.isSafeInteger(session.amount_total) || session.amount_total < 50) {
        return NextResponse.json({ error: 'حالة جلسة الدفع أو مبلغها غير صالح.' }, { status: 400 });
      }
      await markOrderPaid(session.metadata.paymentId, session.id, session.metadata.orderId, session.amount_total);
    } else if (event.type === 'checkout.session.expired') {
      await releaseUnpaidOrder(session.metadata.paymentId, session.id, session.metadata.orderId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Unable to process Stripe checkout webhook:', error);
    return NextResponse.json({ error: 'تعذر معالجة webhook الدفع.' }, { status: 500 });
  }
}
