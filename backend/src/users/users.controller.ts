import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @Get('me/quotes')
  async getMyQuotes(@Request() req: any) {
    // req.user comes from JwtStrategy validate()
    const userId = req.user.userId;
    
    const leads = await this.prisma.lead.findMany({
      where: { userId },
      include: {
        partner: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return leads;
  }
}
