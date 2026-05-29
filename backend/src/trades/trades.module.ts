import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TradesController],
  providers: [TradesService, PrismaService],
})
export class TradesModule {}
