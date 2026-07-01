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

type UserWithRoles = User & {
  roles?: { role: { name: RoleName } }[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private extractRoleNames(user: UserWithRoles): RoleName[] {
    return user.roles?.map((ur) => ur.role.name) ?? [];
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

    const roles = this.extractRoleNames(user as UserWithRoles);
    const token = await this.signToken(user, roles);

    return { accessToken: token };
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const roles = this.extractRoleNames(user as UserWithRoles);
    const token = await this.signToken(user, roles);

    return { accessToken: token };
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
