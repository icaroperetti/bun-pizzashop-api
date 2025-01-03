import Elysia from 'elysia'
import { auth } from '../auth'
import { db } from '../../db/connection'

export const getManegedRestaurant = new Elysia()
  .use(auth)
  .get('/managed-restaurant', async ({ getCurrentUser }) => {
    const { restauranteId } = await getCurrentUser()

    if (!restauranteId) {
      throw new Error('User is not a manager')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where: (fields, { eq }) => eq(fields.id, restauranteId),
    })
    if (!managedRestaurant) {
      throw new Error('User not found')
    }
    return managedRestaurant
  })
