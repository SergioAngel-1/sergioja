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
  
  logger.info('✅ Datos existentes eliminados');

  // Crear perfil
  logger.info('👤 Creando perfil...');
  await prisma.profile.create({
    data: {
      name: 'Sergio Jáuregui',
      availability: 'available',
      location: 'Chile / Remoto',
      email: 'contacto@sergiojaregui.dev',
      githubUrl: 'https://github.com/sergiojaregui',
      linkedinUrl: 'https://linkedin.com/in/sergiojaregui',
      twitterUrl: 'https://twitter.com/sergiojaregui',
    },
  });
  logger.info('✅ Perfil creado');

  // Crear tecnologías
  logger.info('🛠️  Creando tecnologías...');
  const techData = [
    { name: 'React', category: 'frontend', proficiency: 95, yearsOfExperience: 5, color: '#61DAFB' },
    { name: 'Next.js', category: 'frontend', proficiency: 90, yearsOfExperience: 3, color: '#000000' },
    { name: 'TypeScript', category: 'frontend', proficiency: 92, yearsOfExperience: 4, color: '#3178C6' },
    { name: 'Tailwind CSS', category: 'frontend', proficiency: 90, yearsOfExperience: 3, color: '#06B6D4' },
    { name: 'Node.js', category: 'backend', proficiency: 93, yearsOfExperience: 5, color: '#339933' },
    { name: 'Express', category: 'backend', proficiency: 90, yearsOfExperience: 4, color: '#000000' },
    { name: 'PostgreSQL', category: 'backend', proficiency: 88, yearsOfExperience: 4, color: '#336791' },
    { name: 'Prisma', category: 'backend', proficiency: 90, yearsOfExperience: 2, color: '#2D3748' },
    { name: 'Docker', category: 'devops', proficiency: 85, yearsOfExperience: 3, color: '#2496ED' },
  ];
  
  const technologies = await Promise.all(
    techData.map(data => prisma.technology.create({ data }))
  );
  logger.info(`✅ ${technologies.length} tecnologías creadas`);

  // Crear proyectos
  logger.info('📁 Creando proyectos...');
  const project = await prisma.project.create({
    data: {
      slug: 'sergioja',
      title: 'SergioJA',
      description: 'Landing page minimalista con diseño cyberpunk y arquitectura hexagonal interactiva.',
      longDescription:
        'Sitio principal con diseño cyberpunk minimalista, con hero hexagonal central y modales esquineros. Construido con Next.js 14, Framer Motion y sistema de diseño fluido.',
      category: 'web',
      featured: true,
      demoUrl: 'https://sergioja.com',
      repoUrl: 'https://github.com/SergioAngel-1/sergioja',
      isCodePublic: false,
      performanceScore: 98,
      accessibilityScore: 100,
      seoScore: 100,
      publishedAt: new Date(),
    },
  });
  logger.info('✅ 1 proyecto creado');

  // Relacionar proyectos con tecnologías
  logger.info('🔗 Relacionando proyectos con tecnologías...');
  const relations = [
    // SergioJA: React, Next.js, TypeScript, Tailwind CSS
    { projectId: project.id, technologyId: technologies[0].id },
    { projectId: project.id, technologyId: technologies[1].id },
    { projectId: project.id, technologyId: technologies[2].id },
    { projectId: project.id, technologyId: technologies[3].id },
  ];
  
  await prisma.projectTechnology.createMany({ data: relations });
  logger.info(`✅ ${relations.length} relaciones creadas`);

  logger.info('\n✅ Seed completado exitosamente!');
  logger.info('📊 Resumen:');
  logger.info('   - 1 perfil');
  logger.info(`   - ${technologies.length} tecnologías`);
  logger.info('   - 1 proyecto');
  logger.info(`   - ${relations.length} relaciones proyecto-tecnología`);
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
