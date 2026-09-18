import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../prisma.service';

const PaymentProviderProvider = {
  provide: 'PAYMENT_PROVIDER',
  useFactory: () => ({
    createPayment: async () => ({ externalReference: 'demo-ext-ref', providerStatus: 'CREATED' }),
    verifyPayment: async () => ({ status: 'SUCCESS', verified: true }),
    refundPayment: async () => ({ status: 'REFUNDED' }),
    getStatus: async () => ({ status: 'SUCCESS' }),
  }),
};

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, PaymentProviderProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}
