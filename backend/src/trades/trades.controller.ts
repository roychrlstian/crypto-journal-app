import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  createTrade(@Body() createTradeDto: CreateTradeDto, @Req() req: any) {
    return this.tradesService.createTrade(createTradeDto, req.user.userId);
  }

  @Get()
  getAllTrades(@Req() req: any) {
    return this.tradesService.findAll(req.user.userId);
  }

  @Get(':id')
  getTradeById(@Param('id') id: string, @Req() req: any) {
    return this.tradesService.getTradeById(+id, req.user.userId);
  }

  @Delete(':id')
  deleteTrades(@Param('id') id: string, @Req() req: any) {
    return this.tradesService.deleteTrade(+id, req.user.userId);
  }

  @Patch(':id')
  updateTrades(
    @Param('id') id: string,
    @Body() updateTradeDto: UpdateTradeDto,
    @Req() req: any,
  ) {
    return this.tradesService.updateTrade(+id, updateTradeDto, req.user.userId);
  }
}
