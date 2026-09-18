import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../prisma.service';
import { ObjectStorageService } from '../documents/object-storage.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: PrismaService,
          useValue: {
            application: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            document: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            auditLog: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: ObjectStorageService,
          useValue: {
            putObject: jest.fn().mockResolvedValue({ key: 'docs/abc.pdf' }),
            getSignedUrl: jest.fn().mockResolvedValue('https://example.invalid/private/abc.pdf'),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should start KYC when an application is ready for review', async () => {
    (prisma.application.findUnique as jest.Mock).mockResolvedValue({
      id: 'app-1',
      customerId: 'customer-1',
      status: 'DRAFT',
    });

    await service.submitForReview('app-1', 'customer-1');

    expect((prisma.application.update as jest.Mock)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'app-1' },
        data: expect.objectContaining({ status: 'UNDER_REVIEW' }),
      }),
    );
  });

  it('should reject a document and record an audit log when verification fails', async () => {
    const application = {
      id: 'app-1',
      customerId: 'customer-1',
      status: 'DOCUMENTS_PENDING',
    };

    (prisma.application.findUnique as jest.Mock).mockResolvedValue(application);
    (prisma.document.findUnique as jest.Mock).mockResolvedValue({
      id: 'doc-1',
      customerId: 'customer-1',
      verificationStatus: 'PENDING',
      metadata: {},
    });
    (prisma.document.update as jest.Mock).mockResolvedValue({ id: 'doc-1', verificationStatus: 'REJECTED' });

    await service.rejectDocument('doc-1', 'Bad file', 'admin-1');

    expect(prisma.document.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'doc-1' },
        data: expect.objectContaining({ verificationStatus: 'REJECTED' }),
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });
});
