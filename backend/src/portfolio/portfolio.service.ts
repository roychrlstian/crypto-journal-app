import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    userId: number,
  ) {
    return await this.prisma.portfolio.create({
      data: {
        name: createPortfolioDto.name,
        balance: createPortfolioDto.balance,
        userId: userId,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.portfolio.findMany({ where: { userId } });
  }

  async getPortfolioById(id: number, userId: number) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: id, userId: userId },
    });

    if (!portfolio) {
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

    return await this.prisma.portfolio.delete({
      where: { id: id },
    });
  }
}
