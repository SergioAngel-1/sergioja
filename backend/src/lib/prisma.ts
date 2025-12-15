import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Connection pool configuration
const isProduction = process.env.NODE_ENV === 'production';

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: isProduction ? ['error'] : ['query', 'error', 'warn'],
    // Connection pool settings
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
