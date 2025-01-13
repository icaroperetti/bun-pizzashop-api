import Elysia from 'elysia'
import { auth } from '../auth'
import { UnauthorizedError } from '../errors/unauthorized-error'
import dayjs from 'dayjs'
import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { and, count, eq, gte, sql } from 'drizzle-orm'

export const getMonthCanceledOrdersAmount = new Elysia()
  .use(auth)
  .get('/metrics/month-canceled-orders-amount', async ({ getCurrentUser }) => {
    const { restauranteId } = await getCurrentUser()

    if (!restauranteId) {
      throw new UnauthorizedError()
    }

    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')

    const startOfLastMonth = lastMonth.startOf('month')

    const ordersPerMonth = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restauranteId),
          eq(orders.status, 'canceled'),
          gte(orders.createdAt, startOfLastMonth.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

    const currentMonthWithYear = today.format('YYYY-MM') // 2024-02
    const lastMonthWithYear = lastMonth.format('YYYY-MM') // 2024-01

    const currentOrdersAmount = ordersPerMonth.find(
      (orderPerMonth) => orderPerMonth.monthWithYear === currentMonthWithYear,
    )

    const lasMonthOrdersAmount = ordersPerMonth.find(
      (orderPerMonth) => orderPerMonth.monthWithYear === lastMonthWithYear,
    )

    const diffFomLastMonth =
      currentOrdersAmount && lasMonthOrdersAmount
        ? (currentOrdersAmount.amount * 100) / lasMonthOrdersAmount.amount
        : null

    return {
      amount: currentOrdersAmount?.amount,
      diffFromLastMonth: diffFomLastMonth
        ? Number((diffFomLastMonth - 100).toFixed(2))
        : 0,
    }
  })
