import { Injectable } from '@nestjs/common';
import { Trade } from './trades.interface';
import { CreateTradeDto } from './dto/create-trades.dto';

@Injectable()
export class TradesService {
  //temporary storage
  private trades: Trade[] = [];

  createTrade(createTradeDto: CreateTradeDto): Trade {
    const newTrade: Trade = {
      id: Date.now(),
      coin: createTradeDto.coin,
      entry: createTradeDto.entry,
      quantity: createTradeDto.quantity,
    };

    this.trades.push(newTrade);
    return newTrade;
  }

  findAll(): Trade[] {
    return this.trades;
  }
}
