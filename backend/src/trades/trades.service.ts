import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TradesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTrade(createTradeDto: CreateTradeDto) {
    const newTrade = await this.prisma.trade.create({
      data: {
        coin: createTradeDto.coin,
        entry: createTradeDto.entry,
        quantity: createTradeDto.quantity,
      },
    });
    return newTrade;
  }

  findAll() {
    return this.prisma.trade.findMany();
  }

  getTradeById(id: number) {
    if (!id) {
      throw new NotFoundException('Trade ID is required');
    }

    const trade = this.prisma.trade.findUnique({ where: { id } });
    if (!trade) {
      throw new NotFoundException('Trade not found');
    }
    return trade;
  }

  deleteTrade(id: number) {
    if (!id) {
      throw new NotFoundException('Trade ID is required');
    }

    const trade = this.prisma.trade.findUnique({ where: { id } });
    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return this.prisma.trade.delete({ where: { id } });
  }

  updateTrade(id: number, updateTradeDto: UpdateTradeDto) {
    if (!id) {
      throw new NotFoundException('Trade ID is required');
    }

    const trade = this.prisma.trade.findUnique({ where: { id } });
    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return this.prisma.trade.update({ where: { id }, data: updateTradeDto });
  }
}
