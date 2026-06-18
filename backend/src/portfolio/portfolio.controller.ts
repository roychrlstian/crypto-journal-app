import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.portfolioService.createPortfolio(createPortfolioDto, userId);
  }

  @Get()
  getMyPortfolios(@CurrentUser('userId') userId: number) {
    return this.portfolioService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('userId') userId: number) {
    return this.portfolioService.getPortfolioById(+id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: number) {
    return this.portfolioService.deletePortfolio(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.portfolioService.updatePortfolio(
      +id,
      updatePortfolioDto,
      userId,
    );
  }

  @Get('stats')
  getStats(@CurrentUser('userId') userId: number) {
    return this.portfolioService.getPortfolioStats(userId);
  }
}
