import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TradesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTrade(createTradeDto: CreateTradeDto, userId: number) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: createTradeDto.portfolioId },
    });
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You cannot add trades to a portfolio you do not own');
    }
    return this.prisma.trade.create({
      data: {
        coin: createTradeDto.coin,
        entry: createTradeDto.entry,
        quantity: createTradeDto.quantity,
        portfolioId: createTradeDto.portfolioId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.trade.findMany({
      where: {
        portfolio: {
          userId: userId,
        },
      },
    });
  }

  async getTradeById(id: number, userId: number) {
    return this.verifyTradeOwnership(id, userId);
  }

  async deleteTrade(id: number, userId: number) {
    await this.verifyTradeOwnership(id, userId);
    return this.prisma.trade.delete({ where: { id } });
  }

  async updateTrade(id: number, updateTradeDto: UpdateTradeDto, userID: number) {
    await this.verifyTradeOwnership(id, userID);

    return this.prisma.trade.update({ where: { id }, data: updateTradeDto });
  }

  private async verifyTradeOwnership(tradeId: number, userId: number) {
    if (!tradeId) {
      throw new NotFoundException('Trade ID is required');
    }

    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId },
      include: { portfolio: true },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (trade.portfolio.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this trade');
    }

    return trade;
  }
}
