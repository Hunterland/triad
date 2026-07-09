// src/athletes/athletes.module.ts
import { Module } from '@nestjs/common';
import { AthletesController } from './athletes.controller';
import { AthletesService } from './athletes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AthletesController],
  providers: [AthletesService],
  exports: [AthletesService],
})
export class AthletesModule {}
