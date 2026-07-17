import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const phone = '9800000000';
  const passwordHash = await bcrypt.hash('admin_password', 10);

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

  console.log('Seeded Admin User:', admin.phone);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
