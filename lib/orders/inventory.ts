import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';

export async function releaseOrderReservations(
  transaction: Prisma.TransactionClient,
  orderId: string,
) {
  const reservations = await transaction.inventoryReservation.findMany({
    where: { orderItem: { orderId }, status: 'ACTIVE' },
    select: { id: true, variantId: true, warehouseId: true, quantity: true },
  });

  for (const reservation of reservations) {
    const changed = await transaction.inventoryReservation.updateMany({
      where: { id: reservation.id, status: 'ACTIVE' },
      data: { status: 'RELEASED', releasedAt: new Date() },
    });
    if (changed.count !== 1) continue;

    const inventory = await transaction.inventory.updateMany({
      where: {
        variantId: reservation.variantId,
        warehouseId: reservation.warehouseId,
        reserved: { gte: reservation.quantity },
      },
      data: { reserved: { decrement: reservation.quantity } },
    });
    if (inventory.count !== 1) throw new Error('INVENTORY_RESERVATION_INCONSISTENT');

    await transaction.inventoryMovement.create({
      data: {
        variantId: reservation.variantId,
        warehouseId: reservation.warehouseId,
        type: 'RELEASE',
        quantity: reservation.quantity,
        referenceType: 'ORDER',
        referenceId: orderId,
        idempotencyKey: randomUUID(),
      },
    });
  }
}

export async function consumeOrderReservations(
  transaction: Prisma.TransactionClient,
  orderId: string,
) {
  const reservations = await transaction.inventoryReservation.findMany({
    where: { orderItem: { orderId }, status: 'ACTIVE' },
    select: { id: true, variantId: true, warehouseId: true, quantity: true },
  });

  for (const reservation of reservations) {
    const changed = await transaction.inventoryReservation.updateMany({
      where: { id: reservation.id, status: 'ACTIVE' },
      data: { status: 'CONSUMED' },
    });
    if (changed.count !== 1) continue;

    const inventory = await transaction.inventory.updateMany({
      where: {
        variantId: reservation.variantId,
        warehouseId: reservation.warehouseId,
        onHand: { gte: reservation.quantity },
        reserved: { gte: reservation.quantity },
      },
      data: {
        onHand: { decrement: reservation.quantity },
        reserved: { decrement: reservation.quantity },
      },
    });
    if (inventory.count !== 1) throw new Error('INVENTORY_RESERVATION_INCONSISTENT');

    await transaction.inventoryMovement.create({
      data: {
        variantId: reservation.variantId,
        warehouseId: reservation.warehouseId,
        type: 'SALE',
        quantity: -reservation.quantity,
        referenceType: 'ORDER',
        referenceId: orderId,
        idempotencyKey: randomUUID(),
      },
    });
  }
}
