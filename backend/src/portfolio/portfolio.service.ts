import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async createPortfolio(createPortfolioDto: CreatePortfolioDto, userId: number) {
    if (!createPortfolioDto.userId) {
      throw new NotFoundException('User ID is required to create a portfolio');
    }

    if (createPortfolioDto.userId !== userId) {
      throw new NotFoundException('You cannot create a portfolio for another user');
    }

    return await this.prisma.portfolio.create({
      data: {
        name: createPortfolioDto.name,
        balance: createPortfolioDto.balance,
        userId: createPortfolioDto.userId,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.portfolio.findMany({ include: { trades: true }, where: { userId } });
  }

  async getPortfolioById(id: number, userId: number) {
    return this.verifyPortfolioOwnership(id, userId);
  }

  async updatePortfolio(id: number, updatePortfolioDto: UpdatePortfolioDto, userId: number) {
    await this.verifyPortfolioOwnership(id, userId);

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        name: updatePortfolioDto.name,
        balance: updatePortfolioDto.balance,
      },
    });
  }

  async deletePortfolio(id: number, userId: number) {
    await this.verifyPortfolioOwnership(id, userId);

    return await this.prisma.portfolio.delete({ where: { id } });
  }

  async verifyPortfolioOwnership(portfolioId: number, userId: number) {
    if (!portfolioId) {
      throw new NotFoundException('Portfolio ID is required');
    }

    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    if (portfolio.userId !== userId) {
      throw new NotFoundException('You do not have access to this portfolio');
    }

    return portfolio;
  }
}
