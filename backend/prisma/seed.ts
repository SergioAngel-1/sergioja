import { PrismaClient } from '@prisma/client';
import { logger } from '../src/lib/logger';

// Declaración de tipo para process en Node.js
declare const process: {
  exit(code?: number): never;
};

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  logger.info('🗑️  Limpiando datos existentes...');
  await prisma.projectView.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.newsletterSubscription.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.adminUser.deleteMany();
  
  logger.info('✅ Datos existentes eliminados');

  // No crear usuarios admin en seed - usar script create-admin.js
  logger.info('ℹ️  No se crean usuarios admin en seed');
  logger.info('   Usa: node scripts/create-admin.js para crear usuarios');

  logger.info('\n✅ Seed completado exitosamente!');
  logger.info('📊 Resumen:');
  logger.info('   - 0 usuarios admin (crear manualmente con script)');
  logger.info('   - Base de datos limpia y lista para usar desde el panel admin');
}

main()
  .catch((e: Error) => {
    logger.error('❌ Error durante el seed:', e);
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
