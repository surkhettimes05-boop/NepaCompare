import { PrismaClient, PartnerType, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  const adminPhone = process.env.ADMIN_PHONE?.trim() || (isProduction ? '' : '9800000000');
  const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'admin_password');

  if (!adminPhone || !adminPassword) {
    throw new Error('Production seeding requires ADMIN_PHONE and ADMIN_PASSWORD');
  }

  if (adminPassword.length < 16) {
    throw new Error('ADMIN_PASSWORD must be at least 16 characters');
  }

  console.log('Clearing existing data (for MVP dev)...');
  await prisma.rateTable.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.staff.deleteMany();

  console.log('Seeding Admin Staff...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);
  
  await prisma.staff.create({
    data: {
      name: 'Super Admin',
      phone: adminPhone,
      password: hashedPassword,
      role: Role.ADMIN,
      active: true,
    },
  });

  console.log('Seeding Partners...');
  
  const shikhar = await prisma.partner.create({
    data: {
      name: 'Shikhar Insurance',
      type: PartnerType.INSURER,
      integrationType: 'MOCK_STANDARD',
      verticals: ['motor', 'health'],
    },
  });

  const nepalLife = await prisma.partner.create({
    data: {
      name: 'Nepal Life',
      type: PartnerType.INSURER,
      integrationType: 'MOCK_LEGACY_REST',
      verticals: ['life'],
    },
  });

  const sagarmatha = await prisma.partner.create({
    data: {
      name: 'Sagarmatha Health',
      type: PartnerType.INSURER,
      integrationType: 'MOCK_LEGACY_REST',
      verticals: ['health'],
    },
  });

  console.log('Seeding Rate Tables...');

  // Motor Rates (Shikhar)
  await prisma.rateTable.createMany({
    data: [
      {
        partnerId: shikhar.id,
        vertical: 'motor',
        planName: 'Basic Third Party',
        criteria: { type: 'cc', min: 0, max: 150 },
        premiumMin: 4500,
        premiumMax: 4500,
      },
      {
        partnerId: shikhar.id,
        vertical: 'motor',
        planName: 'Comprehensive Motor',
        criteria: { type: 'cc', min: 151, max: 1000 },
        premiumMin: 12500,
        premiumMax: 18200,
      },
    ],
  });

  // Health Rates (Sagarmatha & Shikhar)
  await prisma.rateTable.createMany({
    data: [
      {
        partnerId: sagarmatha.id,
        vertical: 'health',
        planName: 'Family Arogya',
        criteria: { type: 'age', min: 18, max: 40 },
        premiumMin: 8500,
        premiumMax: 8500,
      },
      {
        partnerId: shikhar.id,
        vertical: 'health',
        planName: 'Shikhar MedPlus',
        criteria: { type: 'age', min: 18, max: 50 },
        premiumMin: 11000,
        premiumMax: 11000,
      },
    ],
  });

  // Life Rates (Nepal Life)
  await prisma.rateTable.create({
    data: {
      partnerId: nepalLife.id,
      vertical: 'life',
      planName: 'Term Protect Plus',
      criteria: { type: 'age', min: 25, max: 60 },
      premiumMin: 12500,
      premiumMax: 15000,
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
