import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import readline from 'readline';

const prisma = new PrismaClient();

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function getInput(prompt: string, fallback?: string): Promise<string> {
  const v = await ask(`${prompt}${fallback ? ` [${fallback}]` : ''}: `);
  return v || fallback || '';
}

async function main() {
  console.log('=== Create Admin User ===');
  try {
    const name = process.env.ADMIN_NAME || (await getInput('Name', 'Admin'));
    const email = process.env.ADMIN_EMAIL || (await getInput('Email'));
    const role = (process.env.ADMIN_ROLE || (await getInput('Role', 'admin'))).toLowerCase();
    const password = process.env.ADMIN_PASSWORD || (await getInput('Password (visible input)'));

    if (!email || !email.includes('@')) {
      console.error('Invalid email.');
      process.exit(1);
    }
    if (!password || password.length < 8) {
      console.error('Password must be at least 8 characters.');
      process.exit(1);
    }
    if (!['admin', 'editor'].includes(role)) {
      console.error("Role must be 'admin' or 'editor'.");
      process.exit(1);
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await prisma.adminUser.upsert({
      where: { email },
      update: { name, password: hash, role, isActive: true },
      create: { name, email, password: hash, role, isActive: true },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    });

    console.log('\n✅ Admin user ready');
    console.log(user);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin user');
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
