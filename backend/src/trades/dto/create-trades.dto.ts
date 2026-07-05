import { IsNumber, IsString, IsNotEmpty, Min, IsOptional } from 'class-validator';

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
