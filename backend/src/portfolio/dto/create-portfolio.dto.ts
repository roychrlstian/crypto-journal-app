import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  balance!: number;
}
