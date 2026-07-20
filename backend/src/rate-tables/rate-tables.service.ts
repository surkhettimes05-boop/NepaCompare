import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRateTableDto } from './dto/create-rate-table.dto';
import { UpdateRateTableDto } from './dto/update-rate-table.dto';

@Injectable()
export class RateTablesService {
  constructor(private prisma: PrismaService) {}

  create(createRateTableDto: CreateRateTableDto) {
    return this.prisma.rateTable.create({
      data: createRateTableDto,
    });
  }

  findAll() {
    return this.prisma.rateTable.findMany({
      include: { partner: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.rateTable.findUnique({ where: { id }, include: { partner: true } });
  }

  update(id: string, updateRateTableDto: UpdateRateTableDto) {
    return this.prisma.rateTable.update({
      where: { id },
      data: updateRateTableDto,
    });
  }

  remove(id: string) {
    return this.prisma.rateTable.delete({ where: { id } });
  }

  async bulkImport(rows: any[]) {
    const report = { successful: 0, errors: [] as { rowIndex: number; error: string }[] };
    
    // Fetch all active partners to map by ID or Name
    const partners = await this.prisma.partner.findMany({ select: { id: true, name: true } });
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const premiumMin = parseFloat(row.premiumMin);
        const premiumMax = parseFloat(row.premiumMax);

        if (isNaN(premiumMin) || isNaN(premiumMax)) {
          throw new Error('premiumMin and premiumMax must be numbers');
        }
        if (premiumMin > premiumMax) {
          throw new Error('premiumMin cannot be greater than premiumMax');
        }

        // Validate Partner
        let matchedPartnerId = row.partnerId;
        const partnerExists = partners.find(p => p.id === matchedPartnerId || p.name.toLowerCase() === (matchedPartnerId || '').toLowerCase());
        
        if (!partnerExists) {
          throw new Error(`Partner not found for identifier: ${row.partnerId}`);
        }

        // Build Criteria JSON dynamically from known flat columns
        const criteriaKeys = ['ageMin', 'ageMax', 'sumAssuredMin', 'sumAssuredMax', 'ccMin', 'ccMax', 'vehicleType', 'tripDurationMin', 'tripDurationMax', 'dependentsMin', 'dependentsMax'];
        const criteria: any = {};
        
        for (const key of criteriaKeys) {
          if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
            // Check if it's a number
            const asNum = Number(row[key]);
            criteria[key] = isNaN(asNum) ? row[key] : asNum;
          }
        }

        // Upsert by finding existing record first, because Prisma requires unique constraints for native upsert
        const existing = await this.prisma.rateTable.findFirst({
          where: {
            partnerId: partnerExists.id,
            vertical: row.vertical,
            planName: row.planName,
          }
        });

        if (existing) {
          await this.prisma.rateTable.update({
            where: { id: existing.id },
            data: {
              criteria,
              premiumMin,
              premiumMax,
            }
          });
        } else {
          await this.prisma.rateTable.create({
            data: {
              partnerId: partnerExists.id,
              vertical: row.vertical,
              planName: row.planName,
              criteria,
              premiumMin,
              premiumMax,
            }
          });
        }

        report.successful++;
      } catch (error: any) {
        report.errors.push({ rowIndex: i + 1, error: error.message });
      }
    }
    
    return report;
  }
}
