import { SimulatedRestInsurerAdapter, LegacyRestPayload } from './simulated-rest-insurer.adapter';

describe('SimulatedRestInsurerAdapter', () => {
  let adapter: SimulatedRestInsurerAdapter;

  beforeEach(() => {
    // 0 failure rate for consistent synchronous testing of the transform method
    adapter = new SimulatedRestInsurerAdapter('Test Insurer', 10000, '95.0%', 0);
  });

  describe('transformPayload()', () => {
    it('should map legacy JSON fields into the AdapterRawResponse contract', () => {
      const payload: LegacyRestPayload = {
        Vendor_ID: 'TEST_INSURER_INC',
        Prod_Name: 'STD_TIER',
        Base_Amt: '15000', // string from legacy system
        Cov_String: 'Health-5L',
        Stats: {
          Settlement_Pct: '91.2%',
          Hospitals: 120,
        },
      };

      const result = adapter.transformPayload(payload);

      // Verify mapping
      expect(result.insurerName).toBe('Test Insurer'); // Uses configured name, not Vendor_ID
      expect(result.planName).toBe('Test Insurer Standard');
      expect(result.basePremiumValue).toBe(15000); // Parsed to number
      expect(result.baseCoverageSummary).toBe('Health-5L');
      expect(result.claimSettlementRatio).toBe('91.2%');
      expect(result.metadata.cashlessNetworkSize).toBe(120);
    });
  });
});
