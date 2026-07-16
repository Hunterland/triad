// src/event-participants/dto/create-event-participant.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RegistrationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CreateEventParticipantDto {
  @ApiProperty()
  @IsUUID()
  eventId!: string;

  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiProperty()
  @IsUUID()
  athleteId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  crewId?: string;

  @ApiPropertyOptional({ enum: RegistrationStatus })
  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;
}
