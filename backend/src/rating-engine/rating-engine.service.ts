import { Injectable } from '@nestjs/common';
import { QuoteRequest, QuoteResponse, AdapterRawResponse } from '../insurer-adapters/interfaces';

export interface RatingRule {
  id: string;
  description: string;
  verticals: string[];
  apply: (raw: AdapterRawResponse, req: QuoteRequest, currentPremium: number) => number;
}

@Injectable()
export class RatingEngineService {
  private rules: RatingRule[] = [
    {
      id: 'young-driver-penalty',
      description: 'Add 2500 for applicants under 25 across motor vertical',
      verticals: ['motor'], // Restricting this to motor
      apply: (raw, req, currentPremium) => {
        if (req.applicant.age && req.applicant.age < 25) {
          return currentPremium + 2500;
        }
        return currentPremium;
      },
    },
    {
      id: 'high-cc-penalty',
      description: 'Add 3000 for motor vehicles > 1500 CC',
      verticals: ['motor'],
      apply: (raw, req, currentPremium) => {
        if (req.coverageParameters.cc && req.coverageParameters.cc > 1500) {
          return currentPremium + 3000;
        }
        return currentPremium;
      },
    },
    {
      id: 'pre-existing-conditions-penalty',
      description: 'Add 20% to base premium if pre-existing conditions exist',
      verticals: ['health'],
      apply: (raw, req, currentPremium) => {
        if (req.coverageParameters.preExistingConditions) {
          return currentPremium * 1.20;
        }
        return currentPremium;
      }
    },
    {
      id: 'dependents-bump',
      description: 'Add a flat 15% to base premium for each dependent additively',
      verticals: ['health'],
      apply: (raw, req, currentPremium) => {
        if (req.coverageParameters.dependents && req.coverageParameters.dependents > 0) {
          // Additive: 1 dependent = +15%, 2 dependents = +30%, 3 dependents = +45%
          const multiplier = 1 + (0.15 * req.coverageParameters.dependents);
          return currentPremium * multiplier;
        }
        return currentPremium;
      }
    },
    {
      id: 'motor-vehicle-age-depreciation',
      description: 'Reduce premium by 5% for every year of vehicle age, capped at 50%',
      verticals: ['motor'],
      apply: (raw, req, currentPremium) => {
        if (req.coverageParameters.year) {
          const currentYear = new Date().getFullYear();
          const age = Math.max(0, currentYear - req.coverageParameters.year);
          const discountPercent = Math.min(50, age * 5); // 5% per year, max 50%
          return currentPremium * (1 - (discountPercent / 100));
        }
        return currentPremium;
      }
    },
    {
      id: 'motor-ncb-discount',
      description: 'Apply No Claim Bonus (NCB) discount to the premium',
      verticals: ['motor'],
      apply: (raw, req, currentPremium) => {
        if (req.coverageParameters.ncb) {
          const ncb = req.coverageParameters.ncb; // e.g. 20, 25, 35
          return currentPremium * (1 - (ncb / 100));
        }
        return currentPremium;
      }
    },
    {
      id: 'motor-commercial-usage',
      description: 'Add 40% penalty for commercial usage vehicles',
      verticals: ['motor'],
      apply: (raw, req, currentPremium) => {
        if (req.coverageParameters.usage === 'commercial') {
          return currentPremium * 1.40;
        }
        return currentPremium;
      }
    },
    {
      id: 'life-smoker-penalty',
      description: 'Add 30% penalty for smokers',
      verticals: ['life'],
      apply: (raw, req, currentPremium) => {
        if (req.coverageParameters.smoker) {
          return currentPremium * 1.30;
        }
        return currentPremium;
      }
    },
    {
      id: 'life-sum-assured-scaling',
      description: 'Scale premium by sum assured (base is assumed to be for 10L)',
      verticals: ['life', 'health'],
      apply: (raw, req, currentPremium) => {
        if (req.coverageParameters.sumAssured) {
          const ratio = req.coverageParameters.sumAssured / 1000000;
          return currentPremium * ratio;
        }
        return currentPremium;
      }
    },
  ];

  process(raw: AdapterRawResponse, request: QuoteRequest): QuoteResponse {
    let computedPremium = raw.basePremiumValue;

    // Apply relevant rules
    for (const rule of this.rules) {
      if (rule.verticals.includes(request.vertical) || rule.verticals.includes('all')) {
        computedPremium = rule.apply(raw, request, computedPremium);
      }
    }

    // Determine exclusions based on vertical
    const exclusions =
      request.vertical === 'health'
        ? ['Pre-existing conditions (2 yrs)', 'OPD Consultations']
        : request.vertical === 'life'
        ? ['Suicide within 1st year', 'Hazardous activities']
        : ['Racing/Speed tests', 'Driving under influence'];

    computedPremium = Math.round(computedPremium);

    return {
      insurerName: raw.insurerName,
      planName: raw.planName,
      premiumValue: computedPremium,
      premiumFormatted: `NPR ${computedPremium.toLocaleString()}/yr`,
      coverageSummary: raw.baseCoverageSummary,
      claimSettlementRatio: raw.claimSettlementRatio,
      exclusions,
      metadata: raw.metadata,
    };
  }
}
