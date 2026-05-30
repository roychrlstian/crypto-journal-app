import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateTradeDto {
  @IsString()
  @IsNotEmpty()
  coin!: string;

  @IsNumber()
  @Min(0)
  entry!: number;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  portfolioId!: number;
}
