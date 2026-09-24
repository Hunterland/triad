import { ApiProperty } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';

export class JudgeAssignmentStaffMemberDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  stageName!: string | null;

  @ApiProperty({ nullable: true })
  email!: string | null;

  @ApiProperty()
  isActive!: boolean;
}

export class JudgeAssignmentEventStaffDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty({ enum: StaffRole, enumName: 'StaffRole' })
  role!: StaffRole;

  @ApiProperty({ nullable: true })
  area!: string | null;

  @ApiProperty({ nullable: true })
  order!: number | null;

  @ApiProperty()
  isLead!: boolean;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ type: JudgeAssignmentStaffMemberDto })
  staffMember: JudgeAssignmentStaffMemberDto;
}

export class JudgeAssignmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventStaffId!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  updatedAt!: Date;

  @ApiProperty({ type: JudgeAssignmentEventStaffDto })
  eventStaff: JudgeAssignmentEventStaffDto;
}
