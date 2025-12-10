import { PrismaClient } from '@prisma/client';
import { logger } from '../src/lib/logger';

// Declaración de tipo para process en Node.js
declare const process: {
  exit(code?: number): never;
};

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes en orden correcto (respetando foreign keys)
  logger.info('🗑️  Limpiando datos existentes...');
  
  // 1. Tablas dependientes (con foreign keys)
  await prisma.refreshToken.deleteMany();
  await prisma.projectView.deleteMany();
  await prisma.projectTechnology.deleteMany();
  
  // 2. Tablas principales
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.adminUser.deleteMany();
  
  // 3. Tablas independientes (sin foreign keys)
  await prisma.pageView.deleteMany();
  await prisma.newsletterSubscription.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.projectCategory.deleteMany();
  await prisma.technologyCategory.deleteMany();
  
  logger.info('✅ Todas las tablas limpiadas correctamente');

  // No crear usuarios admin en seed - usar script create-admin.js
  logger.info('ℹ️  No se crean usuarios admin en seed');
  logger.info('   Usa: node scripts/create-admin.js para crear usuarios');

  logger.info('\n✅ Seed completado exitosamente!');
  logger.info('📊 Resumen:');
  logger.info('   - 0 usuarios admin (crear manualmente con script)');
  logger.info('   - Base de datos lista para usar desde el panel admin');
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
