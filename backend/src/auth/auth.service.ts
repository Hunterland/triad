import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RoleName, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';

type UserWithRoles = User & {
  roles?: {
    role: {
      name: RoleName;
    };
  }[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private extractRoleNames(user: UserWithRoles): RoleName[] {
    return user.roles?.map((userRole) => userRole.role.name) ?? [];
  }

  async register(payload: RegisterDto): Promise<{ accessToken: string }> {
    const existing = await this.usersService.findByEmail(payload.email);

    if (existing) {
      throw new ConflictException('Email já está em uso');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await this.usersService.createUserWithRoles({
      email: payload.email,
      passwordHash,
      displayName: payload.displayName,
      roles: [RoleName.ATHLETE],
    });

    const roles = this.extractRoleNames(user);
    const token = await this.signToken(user, roles);

    return { accessToken: token };
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      return null;
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(dto: LoginDto): Promise<{
    accessToken: string;
    user: {
      id: string;
      email: string;
      displayName: string | null;
      roles: RoleName[];
    };
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        displayName: true,
        password: true,
        isActive: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const roles = user.roles.map((userRole) => userRole.role.name);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        roles,
      },
    };
  }

  private async signToken(user: User, roles: RoleName[]): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles,
    };

    return this.jwtService.signAsync(payload);
  }
}
