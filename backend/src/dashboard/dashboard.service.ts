import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(private readonly prisma: PrismaService) {}

    async getDashboard(userId: number) {
        if (!userId) {
            this.logger.warn('User ID is required to fetch dashboard data');
            throw new Error('User ID is required to fetch dashboard data');
        }
        this.logger.log(`Fetching dashboard for user: ${userId}`);
        const [
            portfolioCount,
            portfolioTotals,
            tradeCount,
            statusCounts,
            recentTrades,
        ] = await Promise.all([
            // Number of portfolios owned by this user
            this.prisma.portfolio.count({
                where: { userId },
            }),

            // Sum of the user's stored portfolio balances
            this.prisma.portfolio.aggregate({
                where: { userId },
                _sum: { balance: true },
            }),

            // Total number of trades across the user's portfolios
            this.prisma.trade.count({
                where: { portfolio: { userId } },
            }),

            // Group the user's trades by status
            this.prisma.trade.groupBy({
                by: ['status'],
                where: { portfolio: { userId } },
                _count: { _all: true },
            }),

            // Latest five trades
            this.prisma.trade.findMany({
                where: { portfolio: { userId } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    coin: true,
                    entry: true,
                    exit: true,
                    quantity: true,
                    status: true,
                    createdAt: true,
                    portfolio: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
        ]);

        const tradesByStatus = Object.fromEntries(
            statusCounts.map((item) => [item.status, item._count._all]),
        );

        return {
            summary: {
                portfolioCount,
                totalBalance: portfolioTotals._sum.balance ?? 0,
                tradeCount,
                openTrades: tradesByStatus['OPEN'] ?? 0,
                closedTrades: tradesByStatus['CLOSED'] ?? 0,
            },
            recentTrades,
        };
    }
}
