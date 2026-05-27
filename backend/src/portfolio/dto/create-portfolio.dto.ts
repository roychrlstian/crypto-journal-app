import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  owner: string;

  @IsNumber()
  balance: number;

  @IsArray()
  coins: [];
}
