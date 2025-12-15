import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Connection pool configuration for production stability
function buildDatabaseUrl(): string {
  const baseUrl = process.env.DATABASE_URL || '';
  
  if (process.env.NODE_ENV !== 'production') {
    return baseUrl;
  }

  // Parse URL to check if it already has query parameters
  const hasQueryParams = baseUrl.includes('?');
  const separator = hasQueryParams ? '&' : '?';
  
  // Add connection pool parameters
  const poolParams = 'connection_limit=10&pool_timeout=20';
  
  return `${baseUrl}${separator}${poolParams}`;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: buildDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
