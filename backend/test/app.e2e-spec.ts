process.env.JWT_SECRET = 'test-secret';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Leads API (e2e)', () => {
  let app: INestApplication;

  const mockPrismaService = {
    lead: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'test-uuid-123', ...dto.data })),
      findMany: jest.fn().mockResolvedValue([
        { id: '1', vertical: 'motor', source: 'web', formData: {} }
      ]),
      findUnique: jest.fn().mockResolvedValue({
        id: '1', status: 'NEW'
      }),
      update: jest.fn().mockResolvedValue({
        id: '1', partnerId: 'partner-1', status: 'SENT_TO_PARTNER'
      }),
    },
    leadStatusHistory: {
      create: jest.fn().mockResolvedValue({}),
    },
    staff: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'staff-123') return Promise.resolve({ id: 'staff-123', role: 'AGENT', active: true });
        return Promise.resolve(null);
      }),
    },
    user: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'cust-123') return Promise.resolve({ id: 'cust-123', role: 'CUSTOMER' });
        return Promise.resolve(null);
      }),
    },
    $transaction: jest.fn().mockImplementation(async (callback) => {
      // Execute the callback with the mockPrismaService as the transaction client
      return callback(mockPrismaService);
    }),
  };

  let staffToken: string;
  let customerToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get JwtService to sign test tokens
    const jwtService = moduleFixture.get<JwtService>(JwtService);
    staffToken = jwtService.sign({ sub: 'staff-123', role: 'AGENT' });
    customerToken = jwtService.sign({ sub: 'cust-123', role: 'CUSTOMER' });
  });

  afterEach(async () => {
    await app.close();
  });

  it('/leads (POST) - should create a new lead (public)', () => {
    return request(app.getHttpServer())
      .post('/leads')
      .send({
        vertical: 'health',
        source: 'web',
        formData: { name: 'John Doe', phone: '9800000000', age: '30' }
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toEqual('test-uuid-123');
      });
  });

  it('/leads (GET) - should reject without token', () => {
    return request(app.getHttpServer())
      .get('/leads')
      .expect(401);
  });

  it('/leads (GET) - should reject customer token', () => {
    return request(app.getHttpServer())
      .get('/leads')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);
  });

  it('/leads (GET) - should allow staff token', () => {
    return request(app.getHttpServer())
      .get('/leads')
      .set('Authorization', `Bearer ${staffToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });

  it('/leads/:id/route (PATCH) - should reject customer token', () => {
    return request(app.getHttpServer())
      .patch('/leads/1/route')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ partnerId: 'partner-1' })
      .expect(403);
  });

  it('/leads/:id/route (PATCH) - should route lead and create history with staff token', async () => {
    const res = await request(app.getHttpServer())
      .patch('/leads/1/route')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ partnerId: 'partner-1' })
      .expect(200);

    expect(res.body.partnerId).toEqual('partner-1');
    expect(res.body.status).toEqual('SENT_TO_PARTNER');

    expect(mockPrismaService.lead.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { partnerId: 'partner-1', status: 'SENT_TO_PARTNER' }
    });

    expect(mockPrismaService.leadStatusHistory.create).toHaveBeenCalledWith({
      data: {
        leadId: '1',
        oldStatus: 'NEW',
        newStatus: 'SENT_TO_PARTNER',
        changedById: 'staff-123'
      }
    });
  });
});

