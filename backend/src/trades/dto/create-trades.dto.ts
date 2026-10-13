import { IsNumber, IsString, IsNotEmpty, Min, IsOptional, IsEnum } from 'class-validator';
import { Position } from '../../generated/prisma/browser';

export class CreateTradeDto {
  @IsString()
  @IsNotEmpty()
  coin!: string;

  @IsNumber()
  @Min(0)
  entry!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  exit?: number;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsNumber()
  @IsNotEmpty()
  portfolioId!: number;
}
