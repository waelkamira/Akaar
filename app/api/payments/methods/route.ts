import { NextResponse } from 'next/server';
import { isStripeSandboxConfigured } from '@/lib/payments/stripe.mjs';
import { isMarketplaceEnabled } from '@/lib/marketplace/settings';

export async function GET() {
  try {
    const [cashOnDeliveryEnabled, stripeEnabled] = await Promise.all([
      isMarketplaceEnabled('cashOnDeliveryEnabled'),
      isMarketplaceEnabled('stripeSandboxCheckoutEnabled'),
    ]);
    return NextResponse.json({
      cashOnDeliveryEnabled,
      stripeSandboxCheckoutEnabled: stripeEnabled && isStripeSandboxConfigured(),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load payment methods:', error);
    return NextResponse.json({ error: 'تعذر تحميل وسائل الدفع.' }, { status: 500 });
  }
}
