import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    return await this.prisma.portfolio.create({
      data: createPortfolioDto,
    });
  }

  async findAll() {
    return await this.prisma.portfolio.findMany({ include: { trades: true } });
  }

  async getPortfolioById(id: number) {
    if (!id) {
      throw new NotFoundException('Portfolio ID is required');
    }

    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
      include: { trades: true },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    return portfolio;
  }

  async updatePortfolio(id: number, updatePortfolioDto: UpdatePortfolioDto) {
    const portfolio = await this.prisma.portfolio.findUnique({ where: { id } });
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return await this.prisma.portfolio.update({
      where: { id },
      data: updatePortfolioDto,
    });
  }

  async deletePortfolio(id: number) {
    if (!id) {
      throw new NotFoundException('Portfolio ID is required');
    }
    const portfolio = await this.prisma.portfolio.findUnique({ where: { id } });
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return await this.prisma.portfolio.delete({ where: { id } });
  }
}
