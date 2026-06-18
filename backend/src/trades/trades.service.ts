import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TradesPaginationDto } from './dto/pagination.dto';
import { Prisma } from '@prisma/client';

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
      throw new ForbiddenException(
        'You cannot add trades to a portfolio you do not own',
      );
    }
    return this.prisma.trade.create({
      data: {
        ...createTradeDto,
      },
    });
  }

  async getTrades(query: TradesPaginationDto, userId: number) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { coin, status, sort = 'desc' } = query;

    const whereClause: Prisma.TradeWhereInput = {
      portfolio: {
        userId: userId,
      },
    };

    if (coin) {
      whereClause.coin = coin;
    }

    if (status) {
      whereClause.status = status;
    }

    const [total, trades] = await this.prisma.$transaction([
      this.prisma.trade.count({ where: whereClause }),
      this.prisma.trade.findMany({
        where: whereClause,
        orderBy: { createdAt: sort },
        skip: skip,
        take: limit,
      }),
    ]);

    return {
      data: trades,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    const tradeWithPortfolio = await this.verifyTradeOwnership(id, userId);

    const { portfolio, ...trade } = tradeWithPortfolio;

    return trade;
  }

  async deleteTrade(id: number, userId: number) {
    await this.verifyTradeOwnership(id, userId);
    return this.prisma.trade.delete({ where: { id } });
  }

  async updateTrade(
    id: number,
    updateTradeDto: UpdateTradeDto,
    userId: number,
  ) {
    await this.verifyTradeOwnership(id, userId);

    return this.prisma.trade.update({ where: { id }, data: updateTradeDto });
  }

  private async verifyTradeOwnership(tradeId: number, userId: number) {
    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId },
      include: { portfolio: true },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (trade.portfolio.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this trade',
      );
    }

    return trade;
  }
}
