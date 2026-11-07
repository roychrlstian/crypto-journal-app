import { 
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
  IsOptional,
  IsEnum,
  IsInt
} from 'class-validator';
import { Position } from '../../generated/prisma/browser';

export class CreateTradeDto {
  @IsString()
  @IsNotEmpty()
  coin!: string;

  @IsNumber()
  @Min(0.00000001)
  entry!: number;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @IsNumber()
  @Min(0.00000001)
  quantity!: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  portfolioId!: number;
}
