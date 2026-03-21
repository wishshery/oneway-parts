import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@onewayparts.com' },
    update: {},
    create: {
      email: 'admin@onewayparts.com',
      name: 'Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Doe',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  // Create categories
  const categories = [
    { name: 'Brakes', slug: 'brakes', description: 'Brake pads, rotors, calipers and brake accessories' },
    { name: 'Engine Parts', slug: 'engine-parts', description: 'Belts, gaskets, pumps, and engine components' },
    { name: 'Filters', slug: 'filters', description: 'Oil, air, cabin, and fuel filters' },
    { name: 'Lighting', slug: 'lighting', description: 'Headlights, taillights, LEDs, and bulbs' },
    { name: 'Suspension', slug: 'suspension', description: 'Shocks, struts, control arms, and suspension parts' },
    { name: 'Electrical', slug: 'electrical', description: 'Batteries, alternators, starters, and wiring' },
    { name: 'Body Parts', slug: 'body-parts', description: 'Bumpers, mirrors, fenders, and body panels' },
    { name: 'Interior', slug: 'interior', description: 'Seats, floor mats, and interior accessories' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Create vehicle makes and models
  const vehicleData: Record<string, string[]> = {
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Tacoma', 'Highlander', '4Runner'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey'],
    'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Bronco', 'Ranger'],
    'Chevrolet': ['Silverado', 'Camaro', 'Equinox', 'Traverse', 'Tahoe', 'Malibu'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X1', '7 Series'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class', 'S-Class'],
    'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Frontier', 'Maxima'],
    'Hyundai': ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Kona', 'Palisade'],
    'Kia': ['Forte', 'Sportage', 'Telluride', 'Sorento', 'Soul', 'Seltos'],
    'Volkswagen': ['Jetta', 'Tiguan', 'Atlas', 'Golf', 'Passat', 'Taos'],
  };

  for (const [makeName, models] of Object.entries(vehicleData)) {
    const make = await prisma.vehicleMake.upsert({
      where: { name: makeName },
      update: {},
      create: { name: makeName },
    });
    for (const modelName of models) {
      await prisma.vehicleModel.upsert({
        where: { makeId_name: { makeId: make.id, name: modelName } },
        update: {},
        create: { name: modelName, makeId: make.id },
      });
    }
  }
  console.log('✅ Vehicle makes and models created');

  // Create products
  const brakes = await prisma.category.findUnique({ where: { slug: 'brakes' } });
  const filters = await prisma.category.findUnique({ where: { slug: 'filters' } });
  const lighting = await prisma.category.findUnique({ where: { slug: 'lighting' } });
  const suspension = await prisma.category.findUnique({ where: { slug: 'suspension' } });
  const electrical = await prisma.category.findUnique({ where: { slug: 'electrical' } });
  const engine = await prisma.category.findUnique({ where: { slug: 'engine-parts' } });
  const body = await prisma.category.findUnique({ where: { slug: 'body-parts' } });
  const interior = await prisma.category.findUnique({ where: { slug: 'interior' } });

  const products = [
    { name: 'Premium Ceramic Brake Pads - Front', slug: 'premium-ceramic-brake-pads-front', sku: 'BRK-001', description: 'High-performance ceramic brake pads designed for everyday driving. Features advanced ceramic compound for consistent braking with minimal dust and noise.', shortDescription: 'Low dust, low noise ceramic brake pads with excellent stopping power.', price: 49.99, compareAtPrice: 69.99, stock: 45, brandName: 'StopTech', categoryId: brakes?.id, status: 'ACTIVE' as const, featured: true },
    { name: 'High-Performance Oil Filter', slug: 'high-performance-oil-filter', sku: 'FLT-001', description: 'Premium oil filter with synthetic media for superior filtration. Traps 99% of contaminants for maximum engine protection.', shortDescription: 'Premium synthetic oil filter for maximum engine protection.', price: 12.99, stock: 200, brandName: 'K&N', categoryId: filters?.id, status: 'ACTIVE' as const },
    { name: 'LED Headlight Bulbs H11 6000K', slug: 'led-headlight-bulbs-h11-6000k', sku: 'LGT-001', description: 'Ultra-bright LED headlight bulbs with 6000K pure white color temperature. 300% brighter than halogen with 50,000+ hour lifespan.', shortDescription: '300% brighter LED headlight bulbs with 6000K pure white light.', price: 34.99, compareAtPrice: 49.99, stock: 78, brandName: 'Auxbeam', categoryId: lighting?.id, status: 'ACTIVE' as const },
    { name: 'Complete Strut Assembly - Front Left', slug: 'complete-strut-assembly-front-left', sku: 'SUS-001', description: 'Ready-to-install complete strut assembly includes strut, spring, mount, and bearing. Pre-assembled for easy bolt-on installation.', shortDescription: 'Ready-to-install strut assembly with spring and mount included.', price: 189.99, compareAtPrice: 249.99, stock: 3, brandName: 'Monroe', categoryId: suspension?.id, status: 'ACTIVE' as const, featured: true },
    { name: 'Cabin Air Filter - Activated Carbon', slug: 'cabin-air-filter-activated-carbon', sku: 'FLT-002', description: 'Activated carbon cabin air filter eliminates odors and captures allergens, pollen, and dust. Easy 5-minute installation.', shortDescription: 'Activated carbon filter for clean, fresh cabin air.', price: 18.99, stock: 150, brandName: 'FRAM', categoryId: filters?.id, status: 'ACTIVE' as const },
    { name: 'Alternator 150A Remanufactured', slug: 'alternator-150a-remanufactured', sku: 'ELC-001', description: 'Factory-remanufactured 150-amp alternator. All components tested to meet or exceed OEM specifications. Includes lifetime warranty.', shortDescription: 'Remanufactured 150A alternator with lifetime warranty.', price: 219.99, compareAtPrice: 299.99, stock: 12, brandName: 'Bosch', categoryId: electrical?.id, status: 'ACTIVE' as const },
    { name: 'Serpentine Belt - Multi-Rib', slug: 'serpentine-belt-multi-rib', sku: 'ENG-001', description: 'Premium EPDM serpentine belt with advanced rubber compound for superior durability. Quiet operation with crack-resistant design.', shortDescription: 'Durable EPDM serpentine belt with quiet, crack-resistant design.', price: 24.99, compareAtPrice: 34.99, stock: 95, brandName: 'Gates', categoryId: engine?.id, status: 'ACTIVE' as const },
    { name: 'Brake Rotor Set - Drilled & Slotted', slug: 'brake-rotor-set-drilled-slotted', sku: 'BRK-002', description: 'Performance drilled and slotted brake rotors for improved heat dissipation and wet weather braking. G3000 grade iron construction.', shortDescription: 'Drilled and slotted performance brake rotors.', price: 89.99, compareAtPrice: 129.99, stock: 34, brandName: 'PowerStop', categoryId: brakes?.id, status: 'ACTIVE' as const, featured: true },
    { name: 'All-Weather Floor Mats Set', slug: 'all-weather-floor-mats-set', sku: 'INT-001', description: 'Custom-fit all-weather floor mats with deep channels to trap water, mud, and debris. Made from durable TPE material.', shortDescription: 'Custom-fit all-weather floor mats for complete protection.', price: 59.99, stock: 60, brandName: 'WeatherTech', categoryId: interior?.id, status: 'ACTIVE' as const },
    { name: 'Ignition Coil Pack', slug: 'ignition-coil-pack', sku: 'ENG-002', description: 'Direct-fit ignition coil pack that restores engine performance. Built to OEM specifications with premium materials.', shortDescription: 'OEM-spec ignition coil for reliable engine performance.', price: 39.99, compareAtPrice: 54.99, stock: 42, brandName: 'Delphi', categoryId: engine?.id, status: 'ACTIVE' as const },
    { name: 'Tail Light Assembly - LED', slug: 'tail-light-assembly-led', sku: 'LGT-002', description: 'Full LED tail light assembly with modern design. Direct replacement with plug-and-play wiring. DOT and SAE compliant.', shortDescription: 'LED tail light assembly with plug-and-play installation.', price: 79.99, compareAtPrice: 109.99, stock: 25, brandName: 'Spyder', categoryId: lighting?.id, status: 'ACTIVE' as const },
    { name: 'Front Bumper Cover - Primed', slug: 'front-bumper-cover-primed', sku: 'BDY-001', description: 'Replacement front bumper cover in primed finish, ready for paint. Made from PP plastic to OEM specifications.', shortDescription: 'Primed replacement bumper cover ready for paint.', price: 149.99, stock: 8, brandName: 'Replace', categoryId: body?.id, status: 'ACTIVE' as const },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        ...product,
        lowStockThreshold: 5,
        metaTitle: `${product.name}${product.brandName ? ` by ${product.brandName}` : ''} | ONEWAY Parts`,
        metaDescription: product.shortDescription,
      },
    });
  }
  console.log('✅ Products created');

  // Create site settings
  const settings = [
    { key: 'enable_payments', value: 'false', type: 'boolean' },
    { key: 'enable_reviews', value: 'true', type: 'boolean' },
    { key: 'enable_wishlist', value: 'true', type: 'boolean' },
    { key: 'enable_ai_recommendations', value: 'false', type: 'boolean' },
    { key: 'company_name', value: 'ONEWAY Parts LLC', type: 'string' },
    { key: 'company_email', value: 'info@onewayparts.com', type: 'string' },
    { key: 'company_phone', value: '(713) 555-1234', type: 'string' },
    { key: 'free_shipping_threshold', value: '75', type: 'number' },
    { key: 'tax_rate', value: '0.0825', type: 'number' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Site settings created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
