import { Module } from '@nestjs/common';
import { JudgeScorecardController } from './judge-scorecard.controller';
import { JudgeScorecardService } from './judge-scorecard.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JudgeScorecardController],
  providers: [JudgeScorecardService],
  exports: [JudgeScorecardService],
})
export class JudgingModule {}
