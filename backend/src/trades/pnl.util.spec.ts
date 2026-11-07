import { calculateRealizedPnl } from './pnl.util';

describe('calaculateRealizedPnl', () => {

    it('calculates profit for a LONG position', () => {
        expect(
            calculateRealizedPnl({
                position: 'LONG',
                entry: 100,
                exit: 120,
                quantity: 2,
            }),
        ).toBe(40);
    });

    it('calculates for SHORT position', () => {
        expect(
            calculateRealizedPnl({
                position: 'SHORT',
                entry: 100,
                exit: 80,
                quantity: 2,
            })
        ).toBe(40);
    });

    it('calculates a loss for a LONG trade', () => {
        expect(
        calculateRealizedPnl({
            position: 'LONG',
            entry: 100,
            exit: 80,
            quantity: 2,
        }),
        ).toBe(-40);
    });

    it('calculates a loss for a SHORT trade', () => {
        expect(
        calculateRealizedPnl({
            position: 'SHORT',
            entry: 100,
            exit: 120,
            quantity: 2,
        }),
        ).toBe(-40);
    });

    it('rejects a trade without an exit price', () => {
        expect(() =>
        calculateRealizedPnl({
            position: 'LONG',
            entry: 100,
            exit: null,
            quantity: 2,
        }),
        ).toThrow('Cannot calculate realized P&L without an exit price');
    });

    it('rejects invalid entry prices', () => {
        expect(() =>
        calculateRealizedPnl({
            position: 'LONG',
            entry: 0,
            exit: 120,
            quantity: 2,
        }),
        ).toThrow('Entry, exit, and quantity must be valid positive numbers');
    });

});