import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log(`Attempting to log in user with email: ${loginDto.email}`);

    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      this.logger.warn(`
        Login failed for email: ${loginDto.email} - User not found
        `);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isMatch) {
      this.logger.warn(`
        Login failed for email: ${loginDto.email} - Invalid password
        `);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`
      User with email: ${loginDto.email} logged in successfully
      `);

    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });
    return {
      accessToken: token,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      this.logger.warn(`
        Registration failed for email: ${registerDto.email} - User already exists
        `);
      throw new UnauthorizedException('User already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    this.logger.log(`
      User created with email: ${registerDto.email}
      `);
    return user;
  }
}
