import { ApiProperty } from '@nestjs/swagger';

export class BracketItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty({ example: 'TOP16' })
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
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ nullable: true })
  location!: string | null;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty({ nullable: true })
  endDate!: Date | null;

  @ApiProperty()
  isActive!: boolean;
}

export class CategoryItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ nullable: true })
  rules!: string | null;

  @ApiProperty({ nullable: true })
  minAge!: number | null;

  @ApiProperty({ nullable: true })
  maxAge!: number | null;

  @ApiProperty({ nullable: true })
  level!: string | null;

  @ApiProperty()
  isTeam!: boolean;

  @ApiProperty()
  isActive!: boolean;
}

export class BattleItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  bracketId!: string;

  @ApiProperty({ example: 'ROUND_OF_16' })
  phase!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty({ example: 'PENDING' })
  status!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class BracketViewResponseDto {
  @ApiProperty({ type: BracketItemDto })
  bracket!: BracketItemDto;

  @ApiProperty({ type: EventItemDto })
  event!: EventItemDto;

  @ApiProperty({ type: CategoryItemDto })
  category!: CategoryItemDto;

  @ApiProperty({ type: [BattleItemDto] })
  battles!: BattleItemDto[];
}
