import { Module } from '@nestjs/common';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TradesModule } from './trades/trades.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PortfolioModule, TradesModule, PrismaModule, AuthModule],
})
export class AppModule {}
