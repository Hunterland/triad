// src/judging-configurations/judging-configurations.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JudgingConfigurationsController } from './judging-configurations.controller';
import { JudgingConfigurationsService } from './judging-configurations.service';

@Module({
  imports: [PrismaModule],
  controllers: [JudgingConfigurationsController],
  providers: [JudgingConfigurationsService],
})
export class JudgingConfigurationsModule {}
