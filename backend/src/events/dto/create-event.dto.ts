import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsAfterOrEqualDate } from '../../common/validators/is-after-or-equal-date.validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'TRIAD Battle Finals 2026',
    description: 'Nome do evento',
  })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiProperty({
    example: 'triad-battle-finals-2026',
    description: 'Slug único do evento',
  })
  @IsString()
  @MaxLength(180)
  slug!: string;

  @ApiPropertyOptional({
    example: 'Etapa final do circuito TRIAD 2026.',
    description: 'Descrição do evento',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'São Paulo - SP',
    description: 'Local do evento',
  })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  location?: string;

  @ApiProperty({
    example: '2026-09-20T14:00:00.000Z',
    description: 'Data e hora de início do evento',
  })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({
    example: '2026-09-20T22:00:00.000Z',
    description: 'Data e hora de término do evento',
  })
  @IsOptional()
  @IsDateString()
  @IsAfterOrEqualDate('startDate', {
    message: 'endDate deve ser maior ou igual a startDate',
  })
  endDate?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o evento está ativo',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
