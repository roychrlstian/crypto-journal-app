import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  create(@Body() createPortfolioDto: CreatePortfolioDto, @Req() req: any) {
    return this.portfolioService.createPortfolio(createPortfolioDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.portfolioService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.portfolioService.getPortfolioById(+id, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.portfolioService.deletePortfolio(+id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @Req() req: any,
  ) {
    return this.portfolioService.updatePortfolio(+id, updatePortfolioDto, req.user.userId);
  }
}
