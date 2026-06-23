// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
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

  async findById(id: string) {
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
  }) {
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
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async listAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            userId: true,
            roleId: true,
            createdAt: true,
            role: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  async findPublicById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            userId: true,
            roleId: true,
            createdAt: true,
            role: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  async updateUser(
    id: string,
    data: {
      displayName?: string;
      isActive?: boolean;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            userId: true,
            roleId: true,
            createdAt: true,
            role: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  async deactivateUser(id: string) {
    return this.updateUser(id, { isActive: false });
  }
}
