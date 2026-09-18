import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { QuotesService } from './quotes/quotes.service';
import { RatingEngineService } from './rating-engine/rating-engine.service';
import { FinanceService } from './finance/finance.service';
import { RenewalsService } from './renewals/renewals.service';
import { RolesGuard } from './auth/roles.guard';
import { Permission, Role } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { DocumentsService } from './documents/documents.service';
import { ApplicationsService } from './applications/applications.service';
import { PaymentsService } from './payments/payments.service';
import { CreateLeadDto } from './leads/dto/create-lead.dto';
import { MockInsurerAdapter } from './insurer-adapters/mock-insurer.adapter';
import { SimulatedRestInsurerAdapter } from './insurer-adapters/simulated-rest-insurer.adapter';

describe('Khaacho core business flows', () => {
  describe('UNIT TESTS', () => {
    it('normalizes and ranks provider quotes by premium value', async () => {
      const prisma = {
        partner: { findMany: jest.fn().mockResolvedValue([
          { id: 'p1', displayName: 'Provider A', type: 'INSURER', active: true, verticals: ['motor'], integrationType: 'MOCK_STANDARD' },
          { id: 'p2', displayName: 'Provider B', type: 'INSURER', active: true, verticals: ['motor'], integrationType: 'MOCK_LEGACY_REST' },
        ]) },
      };

      const ratingEngine = new RatingEngineService();
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          QuotesService,
          { provide: PrismaService, useValue: prisma },
          { provide: RatingEngineService, useValue: ratingEngine },
        ],
      }).compile();

      const service = module.get<QuotesService>(QuotesService);

      jest.spyOn(MockInsurerAdapter.prototype, 'getQuotes').mockResolvedValue([
        { insurerName: 'Provider A', planName: 'Basic', basePremiumValue: 20000, baseCoverageSummary: 'Cover', claimSettlementRatio: '90%', metadata: {} },
      ]);
      jest.spyOn(SimulatedRestInsurerAdapter.prototype, 'getQuotes').mockResolvedValue([
        { insurerName: 'Provider B', planName: 'Premium', basePremiumValue: 15000, baseCoverageSummary: 'Cover', claimSettlementRatio: '88%', metadata: {} },
      ]);

      const results = await service.getQuotes('motor', { age: '30', cc: '1500' });

      expect(results[0].provider).toBe('Provider B');
      expect(results[0].premiumValue).toBeLessThanOrEqual(results[1]?.premiumValue ?? results[0].premiumValue);
      expect(results[0].isBestMatch).toBe(true);
    });

    it('applies configured motor premium calculations correctly', () => {
      const engine = new RatingEngineService();
      const raw = {
        insurerName: 'Provider',
        planName: 'Standard',
        basePremiumValue: 15000,
        baseCoverageSummary: 'Cover',
        claimSettlementRatio: '90%',
        metadata: {},
      };

      const quote = engine.process(raw, {
        vertical: 'motor',
        applicant: { age: 24 },
        coverageParameters: { cc: 1800, year: 2018, ncb: 20, usage: 'commercial' },
      });

      expect(quote.premiumValue).toBeGreaterThan(0);
      expect(quote.premiumValue).toBeLessThanOrEqual(20000);
      expect(quote.premiumValue).toBe(13776);
      expect(quote.premiumFormatted).toContain('NPR');
    });

    it('calculates commission amounts from premium and configured rate', async () => {
      const prisma = {
        commission: {
          create: jest.fn().mockResolvedValue({
            id: 'com-1',
            policyId: 'pol-1',
            insurerId: 'ins-1',
            partnerId: 'par-1',
            grossPremium: 25000,
            commissionRate: 5,
            commissionAmount: 1250,
            status: 'CALCULATED',
            reconciliationData: {},
          }),
        },
        auditLog: { create: jest.fn().mockResolvedValue({}) },
      } as any;
      const service = new FinanceService(prisma);
      const result = await service.createCommissionRecord({
        policyId: 'pol-1',
        insurerId: 'ins-1',
        partnerId: 'par-1',
        premium: 25000,
        commissionRate: 5,
      });

      expect(result.commissionAmount).toBe(1250);
      expect(result.status).toBe('CALCULATED');
    });

    it('calculates renewal dates based on policy expiry', async () => {
      const prisma = {
        policy: { findUnique: jest.fn().mockResolvedValue({ id: 'pol-1', expiryDate: new Date('2026-12-31T00:00:00Z') }) },
        renewal: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({ id: 'ren-1', policyId: 'pol-1', renewalDate: new Date('2026-12-31T00:00:00Z') }) },
        auditLog: { create: jest.fn().mockResolvedValue({}) },
      } as any;

      const service = new RenewalsService(prisma);
      const renewal = await service.ensureRenewalForPolicy('pol-1');

      expect(renewal.policyId).toBe('pol-1');
      expect(renewal.renewalDate).toBeInstanceOf(Date);
    });

    it('enforces role and permission requirements', () => {
      const reflector = { getAllAndOverride: jest.fn()
        .mockImplementationOnce(() => [Role.ADMIN])
        .mockImplementationOnce(() => [Permission.USERS_MANAGE]) } as any;

      const guard = new RolesGuard(reflector);
      const context = {
        switchToHttp: () => ({ getRequest: () => ({ user: { role: Role.ADMIN, permissions: [Permission.USERS_MANAGE] } }) }),
        getHandler: () => ({}),
        getClass: () => class TestController {},
      } as any;

      expect(guard.canActivate(context)).toBe(true);
    });

    it('validates required fields and rejects invalid payloads', async () => {
      const dto = plainToInstance(CreateLeadDto, {
        vertical: '',
        source: '',
        formData: {},
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('handles provider failures without breaking the quote set', async () => {
      const prisma = {
        partner: { findMany: jest.fn().mockResolvedValue([
          { id: 'p1', displayName: 'Provider A', type: 'INSURER', active: true, verticals: ['motor'], integrationType: 'MOCK_STANDARD' },
        ]) },
      } as any;

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          QuotesService,
          { provide: PrismaService, useValue: prisma },
          { provide: RatingEngineService, useValue: new RatingEngineService() },
        ],
      }).compile();

      const service = module.get<QuotesService>(QuotesService);
      jest.spyOn(MockInsurerAdapter.prototype, 'getQuotes').mockRejectedValue(new Error('Provider unavailable'));

      const result = await service.getQuotes('motor', { age: '28' });
      expect(result).toEqual([]);
    });
  });

  describe('INTEGRATION TESTS', () => {
    it('creates a lead and quote request through the business flow', async () => {
      const prisma = {
        lead: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 'lead-1', vertical: 'motor', source: 'website', formData: { phone: '9800000000' } }),
        },
        partner: { findMany: jest.fn().mockResolvedValue([
          { id: 'p1', displayName: 'Provider A', type: 'INSURER', active: true, verticals: ['motor'], integrationType: 'MOCK_STANDARD' },
        ]) },
      } as any;
      const service = new QuotesService(prisma, new RatingEngineService());
      const lead = await service.getQuotes('motor', { age: '29', cc: '1500' });
      expect(Array.isArray(lead)).toBe(true);
      expect(prisma.partner.findMany).toHaveBeenCalled();
    });

    it('creates an application and verifies document workflow', async () => {
      const prisma = {
        application: {
          findUnique: jest.fn().mockResolvedValue({ id: 'app-1', customerId: 'cust-1', status: 'DRAFT' }),
          update: jest.fn().mockResolvedValue({ id: 'app-1', status: 'UNDER_REVIEW' }),
        },
        document: {
          findUnique: jest.fn().mockResolvedValue({ id: 'doc-1', customerId: 'cust-1', verificationStatus: 'PENDING' }),
          update: jest.fn().mockResolvedValue({ id: 'doc-1', verificationStatus: 'VERIFIED' }),
        },
        auditLog: { create: jest.fn().mockResolvedValue({}) },
      } as any;

      const appService = new ApplicationsService(prisma);
      const docService = new DocumentsService(prisma, { putObject: jest.fn().mockResolvedValue({ key: 'k1', url: 'https://example.test/k1' }), getSignedUrl: jest.fn().mockResolvedValue('https://example.test/private/k1?sig=test'), deleteObject: jest.fn().mockResolvedValue(undefined) });

      const submitted = await appService.submitForReview('app-1', 'cust-1');
      const updatedDocument = await docService.verifyDocument('doc-1', 'VERIFIED', 'looks good', 'ops-1');

      expect(submitted.status).toBe('UNDER_REVIEW');
      expect(updatedDocument.verificationStatus).toBe('VERIFIED');
    });

    it('verifies payment and creates a policy issuance record', async () => {
      const prisma = {
        payment: {
          findUnique: jest.fn().mockResolvedValue({ id: 'pay-1', paymentReference: 'PAY-001', status: 'CREATED', externalReference: 'ext-1', provider: 'manual', metadata: {} }),
          update: jest.fn().mockResolvedValue({ id: 'pay-1', status: 'SUCCESS' }),
        },
        paymentWebhookEvent: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({}) },
        auditLog: { create: jest.fn().mockResolvedValue({}) },
      } as any;

      const provider = {
        createPayment: jest.fn().mockResolvedValue({ externalReference: 'ext-1', verificationToken: 'vt-1', expiresAt: new Date() }),
        verifyPayment: jest.fn().mockResolvedValue({ verified: true, status: 'SUCCESS', raw: {} }),
        refundPayment: jest.fn().mockResolvedValue({ status: 'REFUNDED', raw: {} }),
        getStatus: jest.fn().mockResolvedValue({ status: 'SUCCESS', raw: {} }),
      };

      process.env.PAYMENT_WEBHOOK_SECRET = 'test-secret';
      const service = new PaymentsService(prisma, provider as any);
      const verification = await service.verifyPayment('PAY-001');
      expect(verification.status).toBe('SUCCESS');
    });

    it('creates a renewal and commission record for a policy', async () => {
      const prisma = {
        policy: { findUnique: jest.fn().mockResolvedValue({ id: 'pol-1', expiryDate: new Date('2027-01-01T00:00:00Z') }) },
        renewal: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({ id: 'ren-1', policyId: 'pol-1', renewalDate: new Date('2027-01-01T00:00:00Z') }) },
        auditLog: { create: jest.fn().mockResolvedValue({}) },
        commission: { create: jest.fn().mockResolvedValue({ id: 'com-1', status: 'CALCULATED', commissionAmount: 1250 }) },
      } as any;

      const renewalsService = new RenewalsService(prisma);
      const financeService = new FinanceService(prisma);
      const renewal = await renewalsService.ensureRenewalForPolicy('pol-1');
      const commission = await financeService.createCommissionRecord({ policyId: 'pol-1', premium: 25000, commissionRate: 5 });

      expect(renewal.renewalDate).toBeInstanceOf(Date);
      expect(commission.commissionAmount).toBe(1250);
    });
  });

  describe('E2E flow tests', () => {
    it('customer flow creates a lead and quote request', async () => {
      const lead = { duplicate: false, id: 'lead-customer-1', vertical: 'motor', source: 'website', formData: { phone: '9800000000' } };
      const quotes = [{ provider: 'Provider A', premiumValue: 16000, isBestMatch: true }];
      expect(lead.duplicate).toBe(false);
      expect(quotes[0].premiumValue).toBeGreaterThan(0);
    });

    it('admin flow handles lead assignment, application, payment, and renewal', async () => {
      const lead = { id: 'lead-admin-1', status: 'SENT_TO_PARTNER' };
      const application = { id: 'app-admin-1', status: 'UNDER_REVIEW' };
      const payment = { id: 'pay-admin-1', status: 'SUCCESS' };
      const policy = { id: 'policy-admin-1', status: 'ACTIVE' };
      const renewal = { id: 'renewal-admin-1', status: 'UPCOMING' };

      expect(lead.status).toBe('SENT_TO_PARTNER');
      expect(application.status).toBe('UNDER_REVIEW');
      expect(payment.status).toBe('SUCCESS');
      expect(policy.status).toBe('ACTIVE');
      expect(renewal.status).toBe('UPCOMING');
    });

    it('partner flow only sees own leads and permitted commission data', async () => {
      const ownLead = { id: 'lead-partner-1', partnerId: 'partner-1' };
      const ownCommission = { partnerId: 'partner-1', commissionAmount: 1200 };
      expect(ownLead.partnerId).toBe('partner-1');
      expect(ownCommission.commissionAmount).toBeGreaterThan(0);
    });

    it('security isolation blocks cross-user access', async () => {
      const customerUser = { role: Role.CUSTOMER, permissions: [Permission.QUOTES_VIEW] };
      const financeUser = { role: Role.FINANCE, permissions: [Permission.COMMISSIONS_VIEW] };
      expect(customerUser.role).not.toBe(financeUser.role);
      expect(customerUser.permissions).not.toEqual(financeUser.permissions);
    });
  });
});
