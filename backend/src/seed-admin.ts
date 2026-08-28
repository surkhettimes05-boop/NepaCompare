import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const phone = process.env.ADMIN_PHONE?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!phone || !password) {
    throw new Error('ADMIN_PHONE and ADMIN_PASSWORD are required');
  }

  if (password.length < 16) {
    throw new Error('ADMIN_PASSWORD must be at least 16 characters');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.staff.upsert({
    where: { phone },
    update: {
      password: passwordHash,
      role: 'ADMIN',
      active: true,
    },
    create: {
      name: 'Super Admin',
      phone,
      password: passwordHash,
      role: 'ADMIN',
      active: true,
    },
  });

  console.log(`Seeded active admin: ${admin.phone}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
