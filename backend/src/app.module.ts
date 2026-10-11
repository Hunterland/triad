// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { StaffModule } from './staff/staff.module';
import { CategoriesModule } from './categories/categories.module';
import { AthletesModule } from './athletes/athletes.module';
import { CrewsModule } from './crews/crews.module';
import { EventParticipantsModule } from './event-participants/event-participants.module';
import { BracketsModule } from './brackets/brackets.module';
import { JudgeAssignmentsModule } from './judge-assignments/judge-assignments.module';
import { JudgingConfigurationsModule } from './judging-configurations/judging-configurations.module';
import { JudgingModule } from './judging/judging.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    EventsModule,
    EventParticipantsModule,
    StaffModule,
    CategoriesModule,
    AthletesModule,
    CrewsModule,
    BracketsModule,
    JudgeAssignmentsModule,
    JudgingConfigurationsModule,
    JudgingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
