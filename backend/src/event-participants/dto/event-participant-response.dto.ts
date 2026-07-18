// src/event-participants/dto/event-participant-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RegistrationStatus } from '@prisma/client';

export class EventParticipantResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  athleteId!: string;

  @ApiPropertyOptional()
  crewId?: string;

  @ApiProperty({ enum: RegistrationStatus })
  status!: RegistrationStatus;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
