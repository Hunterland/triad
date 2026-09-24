import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JudgeAssignmentsController } from './judge-assignments.controller';
import { JudgeAssignmentsService } from './judge-assignments.service';

@Module({
  imports: [PrismaModule],
  controllers: [JudgeAssignmentsController],
  providers: [JudgeAssignmentsService],
})
export class JudgeAssignmentsModule {}
