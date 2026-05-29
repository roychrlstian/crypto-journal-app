import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';

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

  @Get(':id')
  getTradeById(@Param('id') id: string) {
    return this.tradesService.getTradeById(Number(id));
  }

  @Delete(':id')
  deleteTrades(@Param('id') id: string) {
    return this.tradesService.deleteTrade(Number(id));
  }

  @Patch(':id')
  updateTrades(
    @Param('id') id: string,
    @Body() updateTradeDto: UpdateTradeDto,
  ) {
    return this.tradesService.updateTrade(Number(id), updateTradeDto);
  }
}
