import { IsNumber, Min } from 'class-validator';

export class CloseTradeDto {
    @IsNumber()
    @Min(0.00000001)
    exit!: number;
}