import { BadRequestException } from "@nestjs/common";
import { Position } from "../generated/prisma/client";

interface PnlInput {
    position: Position;
    entry: number;
    exit: number | null;
    quantity: number;
}

export function calculateRealizedPnl(input: PnlInput): number {
    const { position, entry, exit, quantity } = input;

    if (exit === null) {
        throw new BadRequestException (
            'Cannot calculate realized PnL without an exit price.'
        );
    }
    if (
        !Number.isFinite(entry) ||
        !Number.isFinite(exit) ||
        !Number.isFinite(quantity) ||
        entry <= 0 || exit <= 0 || quantity <= 0
    ){
        throw new BadRequestException(
            'Entry, exit, and quantity must be finite numbers greater than or equal to zero.'
        )
    }

    if (position === Position.LONG) {
        return (exit - entry) * quantity;
    }
    if (position === Position.SHORT) {
        return (entry - exit) * quantity;
    }

    throw new BadRequestException(
        'Invalid position. Position must be either LONG or SHORT.'
    );
}