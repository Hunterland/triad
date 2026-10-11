import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BattlePhase, BattleSide, BattleStatus } from '@prisma/client';

export class BracketItemDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
  })
  eventId!: string;

  @ApiProperty({
    format: 'uuid',
  })
  categoryId!: string;

  @ApiProperty({
    enum: ['TOP8', 'TOP16'],
    example: 'TOP16',
  })
  type!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class EventItemDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    nullable: true,
  })
  location!: string | null;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty({
    nullable: true,
  })
  endDate!: Date | null;

  @ApiProperty()
  isActive!: boolean;
}

export class CategoryItemDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
  })
  eventId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    nullable: true,
  })
  rules!: string | null;

  @ApiProperty({
    nullable: true,
  })
  minAge!: number | null;

  @ApiProperty({
    nullable: true,
  })
  maxAge!: number | null;

  @ApiProperty({
    nullable: true,
  })
  level!: string | null;

  @ApiProperty()
  isTeam!: boolean;

  @ApiProperty()
  isActive!: boolean;
}

export class BattleCompetitorItemDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
  })
  eventParticipantId!: string;

  @ApiProperty({
    enum: BattleSide,
    example: BattleSide.RED,
  })
  side!: BattleSide;

  @ApiProperty({
    format: 'uuid',
  })
  athleteId!: string;

  @ApiProperty()
  athleteName!: string;

  @ApiPropertyOptional({
    nullable: true,
  })
  athleteStageName!: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
  })
  crewId!: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  crewName!: string | null;

  @ApiProperty()
  isActive!: boolean;
}

export class BattleItemDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
  })
  bracketId!: string;

  @ApiProperty({
    enum: BattlePhase,
    example: BattlePhase.ROUND_OF_16,
  })
  phase!: BattlePhase;

  @ApiProperty()
  order!: number;

  @ApiProperty({
    enum: BattleStatus,
    example: BattleStatus.PENDING,
  })
  status!: BattleStatus;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({
    type: [BattleCompetitorItemDto],
    description:
      'Competidores persistidos na batalha, ordenados por lado. A batalha pode estar sem competidores em fases ainda não preenchidas.',
  })
  competitors!: BattleCompetitorItemDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class BracketViewResponseDto {
  @ApiProperty({
    type: BracketItemDto,
  })
  bracket!: BracketItemDto;

  @ApiProperty({
    type: EventItemDto,
  })
  event!: EventItemDto;

  @ApiProperty({
    type: CategoryItemDto,
  })
  category!: CategoryItemDto;

  @ApiProperty({
    type: [BattleItemDto],
  })
  battles!: BattleItemDto[];
}
