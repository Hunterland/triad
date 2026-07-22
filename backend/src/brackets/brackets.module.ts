// src/brackets/brackets.module.ts
import { Module } from '@nestjs/common';
import { BracketsController } from './brackets.controller';
import { BracketsService } from './brackets.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BracketsController],
  providers: [BracketsService, PrismaService],
})
export class BracketsModule {}
