import { Controller, Post, Body, Param, Get, UseGuards, Req, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions, Roles } from '../auth/roles.decorator';
import { Permission, Role } from '@prisma/client';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.FINANCE)
  @RequirePermissions(Permission.PAYMENTS_VIEW)
  @Post('create')
  createPayment(@Body() body: any, @Req() req: any) {
    return this.paymentsService.createPayment({
      applicationId: body.applicationId,
      amount: body.amount,
      currency: body.currency || 'NPR',
      customerId: body.customerId || req.user?.userId || req.user?.id,
      idempotencyKey: body.idempotencyKey,
      metadata: body.metadata || {},
      provider: body.provider || 'generic',
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.FINANCE)
  @RequirePermissions(Permission.PAYMENTS_VIEW)
  @Get(':paymentReference/status')
  getStatus(@Param('paymentReference') paymentReference: string) {
    return this.paymentsService.getPaymentStatus(paymentReference);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.FINANCE)
  @RequirePermissions(Permission.PAYMENTS_VIEW)
  @Patch(':paymentReference/verify')
  verify(@Param('paymentReference') paymentReference: string) {
    return this.paymentsService.verifyPayment(paymentReference);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.FINANCE)
  @RequirePermissions(Permission.PAYMENTS_VIEW)
  @Post(':paymentReference/refund')
  refund(@Param('paymentReference') paymentReference: string, @Body() body: any) {
    return this.paymentsService.refundPayment(paymentReference, body.amount, body.reason);
  }

  @Post('webhooks/provider')
  handleWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook({
      provider: body.provider || 'generic',
      eventId: body.eventId,
      eventType: body.eventType,
      payload: body.payload || body,
      signature: body.signature,
      paymentReference: body.paymentReference,
    });
  }
}
