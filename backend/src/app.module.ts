import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TradesModule } from './trades/trades.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PortfolioModule, TradesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
