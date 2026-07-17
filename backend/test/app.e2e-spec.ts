import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Leads API (e2e)', () => {
  let app: INestApplication;

  const mockPrismaService = {
    lead: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'test-uuid-123', ...dto.data })),
      findMany: jest.fn().mockResolvedValue([
        { id: '1', vertical: 'motor', source: 'web', formData: {} }
      ]),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/leads (POST) - should create a new lead', () => {
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
        expect(res.body.vertical).toEqual('health');
        expect(mockPrismaService.lead.create).toHaveBeenCalled();
      });
  });

  it('/leads (GET) - should return an array of leads', () => {
    return request(app.getHttpServer())
      .get('/leads')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1);
        expect(res.body[0].vertical).toEqual('motor');
        expect(mockPrismaService.lead.findMany).toHaveBeenCalled();
      });
  });
});

