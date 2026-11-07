import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TradesPaginationDto } from './dto/pagination.dto';
import { Prisma } from '../generated/prisma/client';
import { calculateRealizedPnl } from './pnl.util';

@Injectable()
export class TradesService {
  private readonly logger = new Logger(TradesService.name);

  constructor(private readonly prisma: PrismaService) {}

//CREATE TRADE FUNCTION
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

    if (portfolio.userId !== userId) {
      this.logger.warn(`
        Trade creation failed for user: ${userId} - User does not own portfolio with ID ${createTradeDto.portfolioId}
        `);
      throw new ForbiddenException(
        'You do not have permission to create a trade in this portfolio',
      );
    }

    const createTrade = await this.prisma.trade.create({
      data: {
        coin: createTradeDto.coin,
        position: createTradeDto.position ?? 'LONG',
        entry: createTradeDto.entry,
        quantity: createTradeDto.quantity,
        status: 'OPEN',
        exit: null,
        portfolioId: createTradeDto.portfolioId,
      },
    });

    this.logger.log(`
      Trade created for user: ${userId} in portfolio: ${createTradeDto.portfolioId}
      `);

    return createTrade;
  }
//END CREATE TRADE FUNCTION

//GET TRADES FUNCTION
  async getTrades(query: TradesPaginationDto, userId: number) {
    this.logger.log(`
      Fetching trades for user: ${userId} with query: ${JSON.stringify(query)}
      `);

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
        orderBy: { createdAt: sort || 'desc' },
        skip: skip,
        take: limit,
      }),
    ]);

    const tradesWithPnl = trades.map((trade) => {
      const realizedPnl =
        trade.status === 'CLOSED'
          ? calculateRealizedPnl({
              position: trade.position,
              entry: trade.entry,
              exit: trade.exit,
              quantity: trade.quantity,
            })
          : null;

      return { ...trade, realizedPnl };
    });

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
      data: tradesWithPnl,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
//END GET TRADES FUNCTION

//GET TRADE BY ID FUNCTION
  async getTradeById(id: number, userId: number) {
    this.logger.log(`Fetching trade by ID: ${id} for user: ${userId}`);
    const { portfolio, ...trade } = await this.verifyTradeOwnership(id, userId);
    void portfolio;
    
    const realizedPnl =
      trade.status === 'CLOSED'
        ? calculateRealizedPnl({
            position: trade.position,
            entry: trade.entry,
            exit: trade.exit,
            quantity: trade.quantity,
          })
        : null;

    return { ...trade, realizedPnl };
  }
//END GET TRADE BY ID FUNCTION

//DELETE TRADE FUNCTION
  async deleteTrade(id: number, userId: number) {
    this.logger.log(`Deleting trade ID: ${id} for user: ${userId}`);
    await this.verifyTradeOwnership(id, userId);

    return this.prisma.trade.delete({ where: { id } });
  }
//END DELETE TRADE FUNCTION

//UPDATE TRADE FUNCTION
  async updateTrade(id: number, updateTradeDto: UpdateTradeDto, userId: number) {
    this.logger.log(`Updating trade ID: ${id} for user: ${userId}`);

    const trade = await this.verifyTradeOwnership(id, userId);

    if (trade.status === 'OPEN' && updateTradeDto.exit !== undefined) {
      throw new BadRequestException(
        'Use the close trade operation to set an exit price',
      );
    }

    const updatedTrade = await this.prisma.trade.update({
      where: { id },
      data: updateTradeDto,
    });

    const realizedPnl =
      updatedTrade.status === 'CLOSED'
        ? calculateRealizedPnl({
            position: updatedTrade.position,
            entry: updatedTrade.entry,
            exit: updatedTrade.exit,
            quantity: updatedTrade.quantity,
          })
        : null;

    return { ...updatedTrade, realizedPnl };
  }
//END UPDATE TRADE FUNCTION

//CLOSE TRADE FUNCTION
  async closeTrade(id: number, exit: number, userId: number) {
    this.logger.log(`Closing trade ID: ${id} for user: ${userId}`);

    const trade = await this.verifyTradeOwnership(id, userId);

    if (trade.status !== 'OPEN') {
      throw new BadRequestException('Trade is already closed');
    }

    const updatedTrade = await this.prisma.trade.updateMany({
      where: {
        id,
        status: 'OPEN',
        portfolio: {
          userId,
        },
      },
      data: {
        exit,
        status: 'CLOSED',
      },
    });

    if (updatedTrade.count === 0) {
      throw new BadRequestException(
        'Trade has already been closed or modified',
      );
    }

    const closedTrade = await this.prisma.trade.findUniqueOrThrow({
      where: { id },
    });

    const realizedPnl = calculateRealizedPnl({
      position: closedTrade.position,
      entry: closedTrade.entry,
      exit: closedTrade.exit,
      quantity: closedTrade.quantity,
    });

    return { ...closedTrade, realizedPnl };
  }
//END CLOSE TRADE FUNCTION

//VERIFY TRADE OWNERSHIP FUNCTION
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
//END VERIFY TRADE OWNERSHIP FUNCTION
}
