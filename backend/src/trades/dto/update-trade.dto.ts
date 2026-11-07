
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Position } from '../../generated/prisma/browser';

export class UpdateTradeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  coin?: string;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @IsOptional()
  @IsNumber()
  @Min(0.00000001)
  entry?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.00000001)
  exit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.00000001)
  quantity?: number;
}
