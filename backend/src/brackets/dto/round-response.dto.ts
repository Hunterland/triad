// src/brackets/dto/round-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RoundStatus } from '@prisma/client';

export class RoundResponseDto {
  @ApiProperty({
    example: 'a1d57f4f-c23b-4c25-bf9d-5bfc3e54e06a',
  })
  id!: string;

  @ApiProperty({
    example: 'c7fb49d7-7b86-41f9-85c2-cd99baac5d34',
  })
  battleId!: string;

  @ApiProperty({
    example: 1,
    description: 'Posição sequencial do round dentro da batalha.',
  })
  order!: number;

  @ApiProperty({
    enum: RoundStatus,
    enumName: 'RoundStatus',
    example: RoundStatus.PENDING,
  })
  status!: RoundStatus;

  @ApiProperty({
    example: true,
  })
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
}
