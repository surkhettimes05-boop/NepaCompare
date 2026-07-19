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
