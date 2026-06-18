import { IsInt, IsOptional, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  exchange?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort?: 'asc' | 'desc';
}
