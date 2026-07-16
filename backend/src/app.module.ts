// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { StaffModule } from './staff/staff.module';
import { CategoriesModule } from './categories/categories.module';
import { AthletesModule } from './athletes/athletes.module';
import { CrewsModule } from './crews/crews.module';
import { EventParticipantsModule } from './event-participants/event-participants.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
