import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(private readonly prisma: PrismaService) {}

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
      throw new NotFoundException(
        `Portfolio with name ${createPortfolioDto.name} already exists for user ${userId}`,
      );
    }

    const portfolio = await this.prisma.portfolio.create({
      data: {
        name: createPortfolioDto.name,
        balance: createPortfolioDto.balance,
        userId: userId,
      },
    });
    this.logger.log(`Portfolio created for user: ${userId}`);

    return portfolio;
  }

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

  async deletePortfolio(id: number, userId: number) {
    await this.getPortfolioById(id, userId);
    this.logger.log(`Deleting portfolio ID: ${id} for user: ${userId}`);
    return await this.prisma.portfolio.delete({
      where: { id: id },
    });
  }

  async getPortfolioStats(userId: number) {
    this.logger.log(`Fetching portfolio stats for user: ${userId}`);

    const portfolios = await this.prisma.portfolio.findMany({
      where: { userId },
      include: {
        trades: true,
      },
    });

    if (!portfolios || portfolios.length === 0) {
      this.logger.warn(`No portfolios found for user: ${userId}`);
      throw new NotFoundException(`No portfolios found for user ${userId}`);
    }

    const openTrades = portfolios.reduce((acc, portfolio) => {
      return (
        acc + portfolio.trades.filter((trade) => trade.exit === null).length
      );
    }, 0);

    const closedTrades = portfolios.reduce((acc, portfolio) => {
      return (
        acc + portfolio.trades.filter((trade) => trade.exit !== null).length
      );
    }, 0);

    return portfolios.map((portfolio) => {
      const totalTrades = portfolio.trades.length;
      const totalProfitLoss = portfolio.trades.reduce((acc, trade) => {
        const profitLoss = (trade.entry - (trade.exit || 0)) * trade.quantity;
        return acc + profitLoss;
      }, 0);

      return {
        portfolioId: portfolio.id,
        name: portfolio.name,
        totalTrades: totalTrades,
        openTrades: openTrades,
        closedTrades: closedTrades,
        totalProfitLoss: totalProfitLoss,
      };
    });
  }
}
