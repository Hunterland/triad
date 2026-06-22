import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async list(): Promise<User[]> {
    const prisma = this.prismaService as PrismaClient;
    const users: User[] = await prisma.user.findMany();
    return users;
  }
}
