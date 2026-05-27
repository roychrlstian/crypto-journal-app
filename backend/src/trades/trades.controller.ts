import { Body, Controller, Get, Post } from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trades.dto';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  createTrade(@Body() createTradeDto: CreateTradeDto) {
    return this.tradesService.createTrade(createTradeDto);
  }

  @Get()
  getAllTrades() {
    return this.tradesService.findAll();
  }
}
