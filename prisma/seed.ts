import { PrismaClient } from '@/prisma/generated/client';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

const prisma = new PrismaClient();

async function main() {
  const salt = randomBytes(8).toString('hex');
  const hash = (await scrypt('KwizzAdmin', salt, 32)) as Buffer;
  const adminPassword = salt + '.' + hash.toString('hex');

  await prisma.user.upsert({
    where: { email: 'admin@kwizz.com' },
    update: {},
    create: {
      email: 'admin@kwizz.com',
      name: 'Kwizz Admin',
      password: adminPassword,
    },
  });
  console.log(
    'Admin user added successfully with mail admin@kwizz.com and password KwizzAdmin'
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
