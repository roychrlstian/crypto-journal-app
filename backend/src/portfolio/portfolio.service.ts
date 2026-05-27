import { Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './portfolio.interface';
@Injectable()
export class PortfolioService {
  private portfolio: Portfolio[] = [];

  create(createPortfolioDto: CreatePortfolioDto) {
    const newPortfolio = {
      owner: createPortfolioDto.owner,
      balance: createPortfolioDto.balance,
      coins: createPortfolioDto.coins,
    };

    this.portfolio.push(newPortfolio);
    return newPortfolio;
  }

  findAll() {
    return this.portfolio;
  }

  findOne(id: number) {
    return this.portfolio[id];
  }

  update(id: number, updatePortfolioDto: UpdatePortfolioDto) {
    return `This action updates a #${id} portfolio`;
  }

  remove(id: number) {
    return `This action removes a #${id} portfolio`;
  }
}
