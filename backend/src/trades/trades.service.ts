import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TradesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTrade(createTradeDto: CreateTradeDto) {
    return await this.prisma.trade.create({
      data: {
        coin: createTradeDto.coin,
        entry: createTradeDto.entry,
        quantity: createTradeDto.quantity,
        portfolioId: createTradeDto.portfolioId,
      },
    });
  }

  async findAll() {
    return await this.prisma.trade.findMany();
  }

  async getTradeById(id: number) {
    if (!id) {
      throw new NotFoundException('Trade ID is required');
    }

    const trade = await this.prisma.trade.findUnique({ where: { id } });
    if (!trade) {
      throw new NotFoundException('Trade not found');
    }
    return trade;
  }

  async deleteTrade(id: number) {
    if (!id) {
      throw new NotFoundException('Trade ID is required');
    }

    const trade = await this.prisma.trade.findUnique({ where: { id } });
    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return this.prisma.trade.delete({ where: { id } });
  }

  async updateTrade(id: number, updateTradeDto: UpdateTradeDto) {
    const trade = await this.prisma.trade.findUnique({ where: { id } });
    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return this.prisma.trade.update({ where: { id }, data: updateTradeDto });
  }
}
