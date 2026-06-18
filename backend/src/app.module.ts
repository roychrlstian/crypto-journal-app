import { Module } from '@nestjs/common';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TradesModule } from './trades/trades.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PortfolioModule,
    TradesModule,
    PrismaModule,
    AuthModule,
    DashboardModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class AppModule {}
