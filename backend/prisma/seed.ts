import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Generate a REAL valid bcrypt hash for the password "password123"
  const realPasswordHash = await bcrypt.hash('password123', 10);

  // User 1: Alice (Experienced Trader - Multiple portfolios and trades)
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      passwordHash: realPasswordHash, 
      portfolios: {
        create: [
          {
            name: 'Long Term Retirement',
            balance: 50000.00,
            trades: {
              create: [
                { coin: 'BTC', entry: 42000.00, quantity: 0.5, status: 'OPEN' },
                { coin: 'ETH', entry: 1500.00, exit: 2500.00, quantity: 5.0, status: 'CLOSED' },
              ],
            },
          },
          {
            name: 'Degen Meme Coins',
            balance: 1500.00,
            trades: {
              create: [
                { coin: 'DOGE', entry: 0.08, quantity: 10000, status: 'OPEN' },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✅ Created User 1: ${user1.email}`);

  // User 2: Bob (New Trader - One active portfolio)
  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      passwordHash: realPasswordHash,
      portfolios: {
        create: [
          {
            name: 'Main Stash',
            balance: 12000.50,
            trades: {
              create: [
                { coin: 'SOL', entry: 45.00, quantity: 100, status: 'OPEN' },
                { coin: 'LINK', entry: 12.50, quantity: 200, status: 'OPEN' },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✅ Created User 2: ${user2.email}`);

  // User 3: Charlie (Just joined - Empty portfolio, no trades yet)
  const user3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      passwordHash: realPasswordHash,
      portfolios: {
        create: [
          {
            name: 'First Portfolio',
            balance: 0.00,
            // Notice no trades array here!
          },
        ],
      },
    },
  });
  console.log(`✅ Created User 3: ${user3.email}`);

  console.log('🎉 Seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
