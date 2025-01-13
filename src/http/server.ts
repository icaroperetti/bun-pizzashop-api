import { Elysia } from 'elysia'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'

import { authenticateFromLink } from './routes/authenticate-from-link'
import { signOut } from './routes/sign-out'
import { getProfile } from './routes/get-profile'
import { getManegedRestaurant } from './routes/get-managed-restaurant'
import { getOrderDetails } from './routes/get-order-details'
import { approveOrder } from './routes/approve-order'
import { cancelOrder } from './routes/cancel-order'
import { dispatchOrder } from './routes/dispatch-order'
import { deliverOrder } from './routes/deliever-order'
import { getOrders } from './routes/get-order'
import { getMonthReceipt } from './routes/get-month-receipt'
import { getDayOrdersAmount } from './routes/get-day-orders-amount'
import { getMonthOrdersAmount } from './routes/get-month-orders-amount'
import { getMonthCanceledOrdersAmount } from './routes/get-canceled-month-orders-amount'
import { getPopularProducts } from './routes/get-popular-products'
import { getDailyReceiptInPeriod } from './routes/get-daily-receipt-in-period'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManegedRestaurant)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(cancelOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(getOrders)
  .use(getMonthReceipt)
  .use(getDayOrdersAmount)
  .use(getMonthOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getPopularProducts)
  .use(getDailyReceiptInPeriod)
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = error.status
        return error.toResponse()
      case 'NOT_FOUND':
        return new Response(null, { status: 404 })
      default: {
        console.log(error)
        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})
