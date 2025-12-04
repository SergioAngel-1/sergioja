const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('\n🔐 Crear Usuario Admin\n');

  try {
    // Solicitar datos
    const name = await question('Nombre completo: ');
    const email = await question('Email: ');
    const password = await question('Password (mínimo 8 caracteres): ');

    // Validaciones básicas
    if (!name || !email || !password) {
      console.error('❌ Todos los campos son requeridos');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('❌ El password debe tener al menos 8 caracteres');
      process.exit(1);
    }

    if (!email.includes('@')) {
      console.error('❌ Email inválido');
      process.exit(1);
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('❌ Ya existe un usuario con ese email');
      process.exit(1);
    }

    // Hash password
    console.log('\n🔒 Encriptando password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario admin
    console.log('👤 Creando usuario admin...');
    const admin = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        isActive: true,
      },
    });

    console.log('\n✅ Usuario admin creado exitosamente!\n');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nombre:', admin.name);
    console.log('🔑 Role:', admin.role);
    console.log('🆔 ID:', admin.id);
    console.log('\n⚠️  Guarda estas credenciales en un lugar seguro!\n');

  } catch (error) {
    console.error('\n❌ Error al crear usuario admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
