import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PrismaService } from '../prisma/prisma.service';
import { calculateRealizedPnl } from '../trades/pnl.util';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(private readonly prisma: PrismaService) {}

//CREATE PORTFOLIO FUNCTION
  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    userId: number,
  ) {
    this.logger.log(`Creating portfolio for user: ${userId}`);

    const existingPortfolio = await this.prisma.portfolio.findFirst({
      where: {
        name: createPortfolioDto.name,
        userId: userId,
      },
    });

    if (existingPortfolio) {
      this.logger.warn(`
        Portfolio creation failed for user: ${userId} - Portfolio with name ${createPortfolioDto.name} already exists
        `);
      throw new ConflictException(
        `Portfolio with name ${createPortfolioDto.name} already exists`,
      );
    }

    const portfolio = await this.prisma.portfolio.create({
      data: {
        name: createPortfolioDto.name,
        balance: createPortfolioDto.balance,
        initialBalance: createPortfolioDto.initialBalance,
        userId: userId,
      },
    });
    this.logger.log(`Portfolio created for user: ${userId}`);

    return portfolio;
  }
//END CREATE PORTFOLIO FUNCTION

//GET ALL PORTFOLIOS FUNCTION
  async findAll(userId: number) {
    this.logger.log(`Fetching portfolios for user: ${userId}`);
    const portfolios = await this.prisma.portfolio.findMany({
      where: { userId },
    });

    if (!portfolios || portfolios.length === 0) {
      this.logger.warn(`No portfolios found for user: ${userId}`);
      throw new NotFoundException(`No portfolios found for user ${userId}`);
    }

    return portfolios;
  }
//END GET ALL PORTFOLIOS FUNCTION  

//GET PORTFOLIO BY ID FUNCTION
  async getPortfolioById(id: number, userId: number) {
    this.logger.log(`Fetching portfolio by ID: ${id} for user: ${userId}`);
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: id, userId: userId },
    });

    if (!portfolio) {
      this.logger.warn(`Portfolio not found for user: ${userId}`);
      throw new NotFoundException(`Portfolio not found`);
    }

    return portfolio;
  }
//END GET PORTFOLIO BY ID FUNCTION

//UPDATE PORTFOLIO FUNCTION
  async updatePortfolio(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
    userId: number,
  ) {
    await this.getPortfolioById(id, userId);
    this.logger.log(`Updating portfolio ID: ${id} for user: ${userId}`);

    return this.prisma.portfolio.update({
      where: { id: id },
      data: {
        name: updatePortfolioDto.name,
        balance: updatePortfolioDto.balance,
      },
    });
  }
//END UPDATE PORTFOLIO FUNCTION

//DELETE PORTFOLIO FUNCTION
  async deletePortfolio(id: number, userId: number) {
    await this.getPortfolioById(id, userId);
    this.logger.log(`Deleting portfolio ID: ${id} for user: ${userId}`);
    return await this.prisma.portfolio.delete({
      where: { id: id },
    });
  }
//END DELETE PORTFOLIO FUNCTION

//GET PORTFOLIO STATS FUNCTION
  async getStats(portfolioId: number, userId: number) {
    this.logger.log(`Fetching portfolio stats for user: ${userId}`);

    const portfolio = await this.prisma.portfolio.findFirst({
      where: {
        userId,
        id: portfolioId,
      },
      include: {
        trades: true,
      },
    });

    if (!portfolio) {
      this.logger.warn(`Portfolio ${portfolioId} not found for user: ${userId}`);
      throw new NotFoundException(`Portfolio with ID ${portfolioId} not found`);
    }

    const openTrades = portfolio.trades.filter((trade) => trade.status === 'OPEN').length;
    const closedTrades = portfolio.trades.filter(
      (trade) => trade.status === 'CLOSED',
    ).length;
    const totalTrades = portfolio.trades.length;
    const totalProfitLoss = Number(
      portfolio.trades
        .filter((trade) => trade.status === 'CLOSED')
        .reduce((acc, trade) => {
          return acc + calculateRealizedPnl({
            position: trade.position,
            entry: trade.entry,
            exit: trade.exit,
            quantity: trade.quantity,
          })
        }, 0)
        .toFixed(2)
    );

    return {
      portfolioId: portfolio.id,
      name: portfolio.name,
      totalTrades,
      openTrades,
      closedTrades,
      totalProfitLoss,
    };
  }
//END GET PORTFOLIO STATS FUNCTION

//GET PORTFOLIO PERFORMANCE FUNCTION
  async getPerformance(portfolioId: number, userId: number) {
    this.logger.log(`Fetching portfolio performance for user: ${userId}`);

    const portfolio = await this.prisma.portfolio.findFirst({
      where: {
        userId,
        id: portfolioId,
      },
      include: {
        trades: true,
      },
    });

    if (!portfolio) {
      this.logger.warn(`Portfolio ${portfolioId} not found for user: ${userId}`);
      throw new NotFoundException(`Portfolio with ID ${portfolioId} not found`);
    }

    const tradesWithPnl = portfolio.trades
      .filter((trade) => trade.status === 'CLOSED')
      .map((trade) => {
        const realizedPnl = calculateRealizedPnl({
          position: trade.position,
          entry: trade.entry,
          exit: trade.exit,
          quantity: trade.quantity,
        });
        return { ...trade, realizedPnl };
      });

    const winningTradesList = tradesWithPnl.filter(
      (trade) => trade.realizedPnl > 0,
    );

    const losingTradesList = tradesWithPnl.filter(
      (trade) => trade.realizedPnl < 0,
    );


    const initialBalance = Number(portfolio.initialBalance.toFixed(2));
    const currentBalance = Number(portfolio.balance.toFixed(2));
    const totalRealizedPnl = Number(
      tradesWithPnl
      .reduce((acc, trade) => acc + trade.realizedPnl, 0)
      .toFixed(2),
    );
    const winningTrades = winningTradesList.length;
    const losingTrades = losingTradesList.length;
    const breakevenTrades = tradesWithPnl.filter((trade) => trade.realizedPnl === 0).length;
    const winRate = tradesWithPnl.length > 0 ? Number(((winningTrades / tradesWithPnl.length) * 100).toFixed(2)) : 0;
    const totalInvestedCapital = Number(
      portfolio.trades
      .filter((trade) => trade.status === 'OPEN')
      .reduce((acc, trade) => {
        return acc + trade.entry * trade.quantity;
      }, 0)
      .toFixed(2)
    );
    const totalEquity = Number((currentBalance + totalInvestedCapital).toFixed(2));
    const performancePercentage = initialBalance > 0 ? Number(((totalEquity - initialBalance) / initialBalance * 100).toFixed(2)) : 0;
    const averageWinningPnl = winningTrades > 0 ? Number((
      winningTradesList 
      .reduce((acc, trade) => acc + trade.realizedPnl, 0)
      / winningTrades)
      .toFixed(2)
    ) : 0;
    const averageLosingPnl = losingTrades > 0 ? Number((
      losingTradesList
      .reduce((acc, trade) => acc + trade.realizedPnl, 0)
      / losingTrades)
      .toFixed(2)
    ) : 0;
    const bestTrade = winningTradesList.length > 0 ? winningTradesList.reduce((best, trade) => trade.realizedPnl > best.realizedPnl ? trade : best) : null;
    const worstTrade = losingTradesList.length > 0 ? losingTradesList.reduce((worst, trade) => trade.realizedPnl < worst.realizedPnl ? trade : worst) : null;
    
    return {
      initialBalance,
      currentBalance,
      totalRealizedPnl,
      totalInvestedCapital,
      performancePercentage,
      totalEquity,
      winningTrades,
      losingTrades,
      breakevenTrades,
      winRate,
      averageWinningPnl,
      averageLosingPnl,
      bestTrade,
      worstTrade,
    };
  }
//END GET PORTFOLIO PERFORMANCE FUNCTION
}
