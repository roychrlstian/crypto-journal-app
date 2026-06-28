import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TradesPaginationDto } from './dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TradesService {
  private readonly logger = new Logger(TradesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTrade(createTradeDto: CreateTradeDto, userId: number) {
    this.logger.log(`
      Creating trade for user: ${userId} in portfolio: ${createTradeDto.portfolioId}
      `);

    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: createTradeDto.portfolioId },
    });

    if (!portfolio) {
      this.logger.warn(`
        Trade creation failed for user: ${userId} - Portfolio with ID ${createTradeDto.portfolioId} not found
        `);
      throw new NotFoundException('Portfolio not found');
    }

    const createTrade = await this.prisma.trade.create({
      data: {
        ...createTradeDto,
      },
    });

    this.logger.log(`
      Trade created for user: ${userId} in portfolio: ${createTradeDto.portfolioId}
      `);

    return createTrade;
  }

  async getTrades(query: TradesPaginationDto, userId: number) {
    this.logger.log(`
      Fetching trades for user: ${userId} with query: ${JSON.stringify(query)}
      `);

    const page = Number(query.page);
    const limit = Number(query.limit);
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

    if (total === 0) {
      this.logger.warn(`No trades found for user: ${userId}`);
      throw new NotFoundException('No trades found');
    }

    if (trades.length === 0) {
      this.logger.warn(`
        No trades found for user: ${userId} on page ${page} with limit ${limit}
        `);
      throw new NotFoundException(
        `No trades found for page ${page} with limit ${limit}`,
      );
    }

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

  // async findAll(userId: number) {
  //   const trades = await this.prisma.trade.findMany({
  //     where: {
  //       portfolio: {
  //         userId: userId,
  //       },
  //     },
  //   });

  //   if (!trades || trades.length === 0) {
  //     throw new NotFoundException(`No trades found for user ${userId}`);
  //   }

  //   return trades;
  // }

  async getTradeById(id: number, userId: number) {
    this.logger.log(`Fetching trade by ID: ${id} for user: ${userId}`);
    const tradeWithPortfolio = await this.verifyTradeOwnership(id, userId);

    if (!tradeWithPortfolio) {
      this.logger.warn(`Trade not found for user: ${userId}`);
      throw new NotFoundException('Trade not found');
    }

    const { portfolio, ...trade } = tradeWithPortfolio;

    return trade;
  }

  async deleteTrade(id: number, userId: number) {
    this.logger.log(`Deleting trade ID: ${id} for user: ${userId}`);
    await this.verifyTradeOwnership(id, userId);

    return this.prisma.trade.delete({ where: { id } });
  }

  async updateTrade(
    id: number,
    updateTradeDto: UpdateTradeDto,
    userId: number,
  ) {
    this.logger.log(`Updating trade ID: ${id} for user: ${userId}`);
    await this.verifyTradeOwnership(id, userId);

    return this.prisma.trade.update({ where: { id }, data: updateTradeDto });
  }

  private async verifyTradeOwnership(tradeId: number, userId: number) {
    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId },
      include: { portfolio: true },
    });

    if (!trade) {
      this.logger.warn(`
        Trade with ID: ${tradeId} not found for user: ${userId}
        `);
      throw new NotFoundException('Trade not found');
    }

    if (trade.portfolio.userId !== userId) {
      this.logger.warn(`
        User: ${userId} is not the owner of trade: ${tradeId}
        `);
      throw new ForbiddenException(
        'You do not have permission to access this trade',
      );
    }

    return trade;
  }
}
