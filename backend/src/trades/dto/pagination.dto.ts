import { IsInt, IsOptional, Min, Max, IsString, IsIn, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TradeStatus } from '../../generated/prisma/browser';

export class TradesPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  coin?: string;

  @IsOptional()
  @IsEnum(TradeStatus)
  status?: TradeStatus;

  @IsOptional()
  @IsString()
  exchange?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort?: 'asc' | 'desc';
}
