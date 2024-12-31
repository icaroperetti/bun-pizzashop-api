import {pgTable, serial,text,timestamp,pgEnum} from 'drizzle-orm/pg-core'
import {createId} from '@paralleldrive/cuid2'

export const userRoleEnum = pgEnum('user_role', ['manager', 'customer'])

export const user = pgTable('users', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: userRoleEnum("role").default('customer').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
})
