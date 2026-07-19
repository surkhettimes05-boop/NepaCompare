import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RenewalsService {
  constructor(private prisma: PrismaService) {}

  async getPoliciesForUser(userId: string) {
    // If the user has no policies, we will seed one mock policy for testing the "1-Click Renew"
    const count = await this.prisma.policy.count({ where: { userId } });
    if (count === 0) {
      await this.prisma.policy.create({
        data: {
          userId,
          insurer: 'Shikhar Insurance',
          planName: 'Comprehensive Motor',
          vertical: 'motor',
          premium: 11500,
          startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // 1 year ago
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Expires in 7 days
          status: 'EXPIRING_SOON',
        }
      });
    }

    return this.prisma.policy.findMany({
      where: { userId },
      orderBy: { endDate: 'asc' },
    });
  }

  async getAllExpiringPolicies() {
    return this.prisma.policy.findMany({
      where: {
        status: 'EXPIRING_SOON',
      },
      include: {
        user: true,
      },
      orderBy: { endDate: 'asc' },
    });
  }
}
