import { Injectable, NotFoundException } from '@nestjs/common';
import { Trade } from './trades.interface';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';

@Injectable()
export class TradesService {
  //temporary storage
  private trades: Trade[] = [];

  createTrade(createTradeDto: CreateTradeDto): Trade {
    const newTrade: Trade = {
      id: Date.now(),
      ...createTradeDto,
    };

    this.trades.push(newTrade);
    return newTrade;
  }

  findAll(): Trade[] {
    return this.trades;
  }

  getTradeById(id: number) {
    const trade = this.trades.find((trade) => trade.id === id);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return trade;
  }

  deleteTrade(id: number) {
    return this.trades.filter((trade) => trade.id !== id);
  }

  updateTrade(id: number, updateTradeDto: UpdateTradeDto) {
    const tradeIndex = this.trades.findIndex((trade) => trade.id === id);

    if (tradeIndex === -1) {
      throw new NotFoundException('Trade not found');
    }

    this.trades[tradeIndex] = { ...this.trades[tradeIndex], ...updateTradeDto };
    return this.trades[tradeIndex];
  }
}
