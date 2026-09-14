import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../../generated/prisma/client'
import { env } from '@/config/env'

// A single shared Prisma client for the whole process. Never instantiate
// `new PrismaClient()` anywhere else — import `prisma` from here instead.
//
// The schema uses the newer `prisma-client` generator with a custom output
// (see prisma/schema.prisma), paired with Neon's serverless driver adapter
// (@prisma/adapter-neon + @neondatabase/serverless) rather than Prisma's
// bundled query engine binary — this matches the driver-adapter packages
// already present in package.json.
const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL })

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect()
}
