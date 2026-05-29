import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Create the PostgreSQL adapter using your .env variable
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    // 2. Feed that adapter into the PrismaClient (This fixes the error!)
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
