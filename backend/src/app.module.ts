import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradesController } from './trades/trades.controller';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TradesService } from './trades/trades.service';
import { TradesModule } from './trades/trades.module';

@Module({
  imports: [PortfolioModule, TradesModule],
  controllers: [AppController, TradesController],
  providers: [AppService, TradesService],
})
export class AppModule {}
