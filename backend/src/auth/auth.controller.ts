import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, CustomerLoginDto, CustomerRegisterDto } from './dto/auth.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() body: LoginDto) {
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

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('customer-register')
  async customerRegister(@Body() body: CustomerRegisterDto) {
    const { email, phone, password, name } = body;
    
    // Check if user exists by email or phone
    const existingUserEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existingUserEmail) {
      throw new UnauthorizedException('Email already registered');
    }
    const existingUserPhone = await this.prisma.user.findUnique({ where: { phone } });
    if (existingUserPhone) {
      throw new UnauthorizedException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        name,
      }
    });

    const payload = { sub: user.id, email: user.email, role: 'CUSTOMER' };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'CUSTOMER'
      }
    };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('customer-login')
  async customerLogin(@Body() body: CustomerLoginDto) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: 'CUSTOMER' };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'CUSTOMER'
      }
    };
  }
}
