import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    const { phone, password } = body;
    const staff = await this.prisma.staff.findUnique({ where: { phone } });

    if (!staff || !staff.active || !staff.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: staff.id, phone: staff.phone, role: staff.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: staff.id,
        name: staff.name,
        role: staff.role
      }
    };
  }
}
