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
  await prisma.contactSubmission.deleteMany();
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.profile.deleteMany();
  
  logger.info('✅ Datos existentes eliminados');

  // Crear perfil
  logger.info('👤 Creando perfil...');
  await prisma.profile.create({
    data: {
      name: 'Sergio Jáuregui',
      title: 'Full Stack Developer',
      tagline: 'Construyendo el futuro con código y automatización',
      bio: 'Desarrollador full stack especializado en automatización, tecnología escalable y estrategia para generar valor de negocio.',
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
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        slug: 'portfolio-profesional',
        title: 'Portfolio Profesional',
        description: 'Portfolio interactivo con terminal funcional y diseño futurista',
        longDescription: 'Portfolio profesional desarrollado con Next.js 14, TypeScript y Tailwind CSS. Incluye terminal interactivo, sistema de internacionalización y mini-juegos.',
        category: 'fullstack',
        featured: true,
        performanceScore: 95,
        accessibilityScore: 98,
        seoScore: 92,
        publishedAt: new Date(),
      },
    }),
    prisma.project.create({
      data: {
        slug: 'sistema-automatizacion',
        title: 'Sistema de Automatización',
        description: 'Plataforma de automatización de procesos empresariales',
        longDescription: 'Sistema desarrollado con Node.js para automatizar procesos repetitivos.',
        category: 'backend',
        featured: false,
        performanceScore: 88,
        accessibilityScore: 85,
        seoScore: 80,
        publishedAt: new Date(),
      },
    }),
    prisma.project.create({
      data: {
        slug: 'plataforma-ecommerce',
        title: 'Plataforma E-commerce',
        description: 'E-commerce con arquitectura escalable',
        longDescription: 'Plataforma de comercio electrónico construida con Next.js y PostgreSQL.',
        category: 'web',
        featured: true,
        performanceScore: 90,
        accessibilityScore: 92,
        seoScore: 88,
        publishedAt: new Date(),
      },
    }),
  ]);
  logger.info(`✅ ${projects.length} proyectos creados`);

  // Relacionar proyectos con tecnologías
  logger.info('🔗 Relacionando proyectos con tecnologías...');
  const relations = [
    // Portfolio: React, Next.js, TypeScript, Tailwind, Node.js, PostgreSQL
    { projectId: projects[0].id, technologyId: technologies[0].id },
    { projectId: projects[0].id, technologyId: technologies[1].id },
    { projectId: projects[0].id, technologyId: technologies[2].id },
    { projectId: projects[0].id, technologyId: technologies[3].id },
    { projectId: projects[0].id, technologyId: technologies[4].id },
    { projectId: projects[0].id, technologyId: technologies[6].id },
    // Automatización: Node.js, Express, PostgreSQL
    { projectId: projects[1].id, technologyId: technologies[4].id },
    { projectId: projects[1].id, technologyId: technologies[5].id },
    { projectId: projects[1].id, technologyId: technologies[6].id },
    // E-commerce: React, Next.js, TypeScript, PostgreSQL, Docker
    { projectId: projects[2].id, technologyId: technologies[0].id },
    { projectId: projects[2].id, technologyId: technologies[1].id },
    { projectId: projects[2].id, technologyId: technologies[2].id },
    { projectId: projects[2].id, technologyId: technologies[6].id },
    { projectId: projects[2].id, technologyId: technologies[8].id },
  ];
  
  await prisma.projectTechnology.createMany({ data: relations });
  logger.info(`✅ ${relations.length} relaciones creadas`);

  // Crear eventos de timeline
  logger.info('📅 Creando timeline...');
  const timelineEvents = [
    {
      type: 'work',
      title: 'Senior Full Stack Developer',
      organization: 'Tech Company',
      description: 'Desarrollo de soluciones empresariales escalables.',
      startDate: new Date('2022-01-01'),
      current: true,
      technologies: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      type: 'education',
      title: 'Ingeniería en Informática',
      organization: 'Universidad',
      description: 'Especialización en desarrollo de software.',
      startDate: new Date('2016-03-01'),
      endDate: new Date('2020-12-31'),
      current: false,
      technologies: [],
    },
  ];
  
  await prisma.timelineEvent.createMany({ data: timelineEvents });
  logger.info(`✅ ${timelineEvents.length} eventos de timeline creados`);

  logger.info('\n✅ Seed completado exitosamente!');
  logger.info('📊 Resumen:');
  logger.info('   - 1 perfil');
  logger.info(`   - ${technologies.length} tecnologías`);
  logger.info(`   - ${projects.length} proyectos`);
  logger.info(`   - ${relations.length} relaciones proyecto-tecnología`);
  logger.info(`   - ${timelineEvents.length} eventos de timeline`);
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
