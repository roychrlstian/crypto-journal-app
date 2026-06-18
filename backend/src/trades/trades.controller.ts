import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TradesPaginationDto } from './dto/trades-pagination.dto';

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  createTrade(
    @Body() createTradeDto: CreateTradeDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tradesService.createTrade(createTradeDto, userId);
  }

  @Get()
  getTrades(
    @Query() query: TradesPaginationDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tradesService.getTrades(query, userId);
  }

  // @Get()
  // getAllTrades(@CurrentUser('userId') userId: number) {
  //   return this.tradesService.findAll(userId);
  // }

  @Get(':id')
  getTradeById(@Param('id') id: string, @CurrentUser('userId') userId: number) {
    return this.tradesService.getTradeById(+id, userId);
  }

  @Delete(':id')
  deleteTrades(@Param('id') id: string, @CurrentUser('userId') userId: number) {
    return this.tradesService.deleteTrade(+id, userId);
  }

  @Patch(':id')
  updateTrades(
    @Param('id') id: string,
    @Body() updateTradeDto: UpdateTradeDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tradesService.updateTrade(+id, updateTradeDto, userId);
  }
}
