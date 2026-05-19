import path from 'path'
import { defineConfig } from '@prisma/config'
import { config } from 'dotenv'

config({ path: path.resolve(__dirname, '.env.local') })
config({ path: path.resolve(__dirname, '.env') })

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? '',
    shadowDatabaseUrl: process.env.DATABASE_URL_UNPOOLED,
  },
})
