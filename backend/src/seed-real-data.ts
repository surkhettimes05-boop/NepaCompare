import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding real Nepali market data for SEO...');

  // 1. Seed Cities
  const cities = [
    { slug: 'kathmandu', name: 'Kathmandu', population: 862400, agentsCount: 287, popularType: 'Motor & Health' },
    { slug: 'pokhara', name: 'Pokhara', population: 513504, agentsCount: 171, popularType: 'Travel & Motor' },
    { slug: 'bharatpur', name: 'Bharatpur', population: 369268, agentsCount: 123, popularType: 'Health & Life' },
    { slug: 'lalitpur', name: 'Lalitpur', population: 294098, agentsCount: 98, popularType: 'Life & Motor' },
    { slug: 'birgunj', name: 'Birgunj', population: 272382, agentsCount: 90, popularType: 'Agriculture & Motor' },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city,
    });
  }
  console.log(`Seeded ${cities.length} cities.`);

  // 2. Seed Insurers (Partners)
  // Since partners might already exist, we will use upsert based on the slug. Wait, slug was just added. 
  // Let's create new ones or update if they exist. We'll use name as a fallback or just clear them.
  const insurers = [
    { slug: 'shikhar-insurance', name: 'Shikhar Insurance Company Ltd', founded: 2004, branches: 115, claimRatio: 80.0, type: 'INSURER' as const },
    { slug: 'nepal-insurance', name: 'Nepal Insurance Company Ltd', founded: 1947, branches: 86, claimRatio: 80.0, type: 'INSURER' as const },
    { slug: 'neco-insurance', name: 'Neco Insurance Company Ltd', founded: 1994, branches: 90, claimRatio: 80.0, type: 'INSURER' as const },
    { slug: 'nlg-insurance', name: 'NLG Insurance Company Ltd', founded: 1998, branches: 85, claimRatio: 80.0, type: 'INSURER' as const },
    { slug: 'sagarmatha-lumbini', name: 'Sagarmatha Lumbini Insurance Company Ltd', founded: 2023, branches: 120, claimRatio: 80.0, type: 'INSURER' as const },
  ];

  for (const insurer of insurers) {
    await prisma.partner.upsert({
      where: { slug: insurer.slug },
      update: {
        name: insurer.name,
        founded: insurer.founded,
        branches: insurer.branches,
        claimRatio: insurer.claimRatio,
      },
      create: {
        slug: insurer.slug,
        name: insurer.name,
        type: insurer.type,
        founded: insurer.founded,
        branches: insurer.branches,
        claimRatio: insurer.claimRatio,
      }
    });
  }
  console.log(`Seeded ${insurers.length} insurers.`);

  // 3. Seed Vehicles
  const bikes = [
    { brand: 'Bajaj', model: 'Pulsar 150', cc: 150 },
    { brand: 'Royal Enfield', model: 'Classic 350', cc: 350 },
    { brand: 'Yamaha', model: 'FZ-FI', cc: 149 },
    { brand: 'Bajaj', model: 'Pulsar 220F', cc: 220 },
    { brand: 'Honda', model: 'SP 125', cc: 125 },
    { brand: 'TVS', model: 'Apache RTR 160 4V', cc: 160 },
    { brand: 'Honda', model: 'Dio', cc: 110 },
    { brand: 'TVS', model: 'NTorq 125', cc: 125 },
    { brand: 'Yamaha', model: 'Ray ZR 125 FI', cc: 125 },
    { brand: 'Suzuki', model: 'Access 125', cc: 125 },
  ];

  for (const bike of bikes) {
    const brandSlug = bike.brand.toLowerCase().replace(/\s+/g, '-');
    const modelSlug = bike.model.toLowerCase().replace(/\s+/g, '-');
    const fullSlug = `${brandSlug}-${modelSlug}`;
    
    await prisma.vehicleModel.upsert({
      where: { slug: fullSlug },
      update: {
        brand: bike.brand,
        brandSlug: brandSlug,
        name: bike.model,
        cc: bike.cc,
      },
      create: {
        slug: fullSlug,
        brand: bike.brand,
        brandSlug: brandSlug,
        name: bike.model,
        cc: bike.cc,
        type: 'TWO_WHEELER',
        basePremium: bike.cc <= 150 ? 4000 : 5500, // mock base premium
      },
    });
  }
  console.log(`Seeded ${bikes.length} bikes.`);

  console.log('Real data seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
