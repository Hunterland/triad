import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BattleSide } from '@prisma/client';

export class BattleCompetitorResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '0bdf3d0a-03f4-4b24-8f21-7d9a5f32a101',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: 'b693c4de-c7f3-4b3f-9a45-3a2d5c8a4d01',
  })
  eventParticipantId!: string;

  @ApiProperty({
    enum: BattleSide,
    example: BattleSide.RED,
  })
  side!: BattleSide;

  @ApiProperty({
    format: 'uuid',
    example: '3e8a90e2-30be-4f91-8c55-2be08ebc0123',
  })
  athleteId!: string;

  @ApiProperty()
  athleteName!: string;

  @ApiPropertyOptional()
  athleteStageName?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
  })
  crewId?: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  crewName?: string | null;

  @ApiProperty()
  isActive!: boolean;
}
