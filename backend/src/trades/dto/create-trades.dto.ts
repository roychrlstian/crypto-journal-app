import { IsNumber, IsString } from 'class-validator';

export class CreateTradeDto {
  @IsString()
  coin: string;

  @IsNumber()
  entry: number;

  @IsNumber()
  quantity: number;
}
