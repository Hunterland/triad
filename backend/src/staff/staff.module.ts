import { Module } from '@nestjs/common';
import { StaffMembersController } from './staff-members.controller';
import { StaffMembersService } from './staff-members.service';
import { EventStaffController } from './event-staff.controller';
import { EventStaffService } from './event-staff.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StaffMembersController, EventStaffController],
  providers: [StaffMembersService, EventStaffService, PrismaService],
})
export class StaffModule {}
