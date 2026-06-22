// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient, RoleName, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private prisma: PrismaClient;

  constructor(private readonly prismaService: PrismaService) {
    this.prisma = this.prismaService as unknown as PrismaClient;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async createUserWithRoles(params: {
    email: string;
    passwordHash: string;
    displayName?: string;
    roles?: RoleName[];
  }): Promise<User> {
    const {
      email,
      passwordHash,
      displayName,
      roles = [RoleName.ATHLETE],
    } = params;

    return this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        displayName,
        roles: {
          create: roles.map((name) => ({
            role: {
              connect: { name },
            },
          })),
        },
      },
    });
  }

  async listAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}
