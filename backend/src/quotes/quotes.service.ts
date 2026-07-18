import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async getQuotes(vertical: string, criteria: any) {
    // 1. Fetch all rate tables for the vertical, including insurer details
    const rateTables = await this.prisma.rateTable.findMany({
      where: { vertical },
      include: { partner: true },
    });

    // 2. Filter rates in-memory (MVP simple matching)
    // E.g., if criteria passed is ?age=30, check if 30 is between min/max in the JSON criteria.
    const matchedQuotes = rateTables.filter((rate) => {
      if (!rate.criteria) return true; // Matches all if no criteria

      const crit = rate.criteria as any;
      if (crit.type === 'age' && criteria.age) {
        const age = parseInt(criteria.age, 10);
        return age >= crit.min && age <= crit.max;
      }
      if (crit.type === 'cc' && criteria.cc) {
        const cc = parseInt(criteria.cc, 10);
        return cc >= crit.min && cc <= crit.max;
      }
      
      // Default to returning the rate if criteria doesn't explicitly disqualify it for the MVP
      return true;
    });

    // 3. Map into a clean response format
    return matchedQuotes.map((rate) => ({
      id: rate.id,
      insurer: rate.partner.name,
      plan: rate.planName,
      premium: `NPR ${rate.premiumMin.toLocaleString()}/yr`,
      coverage: vertical === 'life' ? '50 Lakhs' : vertical === 'health' ? '5 Lakhs' : 'Full Value', // Dummy coverage
    }));
  }
}
