import { PartialType } from '@nestjs/mapped-types';
import { CreateTradeDto } from './create-trades.dto';

export class UpdateTradeDto extends PartialType(CreateTradeDto) {}
