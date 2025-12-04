import { PrismaClient } from '@prisma/client';
import { logger } from '../src/lib/logger';
import bcrypt from 'bcrypt';

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

  // Crear usuarios admin
  logger.info('👥 Creando usuarios admin...');
  const SALT_ROUNDS = 10;
  
  const adminUsers = [
    {
      name: 'Sergio Jáuregui',
      email: 'owner@sergioja.com',
      password: '',
      role: 'admin',
    },
  ];

  for (const userData of adminUsers) {
    const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    await prisma.adminUser.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: passwordHash,
        role: userData.role,
        isActive: true,
      },
    });
    logger.info(`   ✅ Usuario ${userData.role}: ${userData.email}`);
  }
  
  logger.info(`✅ ${adminUsers.length} usuarios admin creados`);

  logger.info('\n✅ Seed completado exitosamente!');
  logger.info('📊 Resumen:');
  logger.info(`   - ${adminUsers.length} usuarios admin`);
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
