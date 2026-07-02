// src/categories/dto/create-category.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { IsInt } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'ID do evento ao qual a categoria pertence',
    example: 'b4305d4d-6b1d-45b2-a5dc-9dcafbc679fc',
  })
  @IsUUID()
  eventId!: string;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Breaking 1x1 Adulto Masculino',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Slug único da categoria dentro do evento',
    example: 'breaking-1x1-adulto-masculino',
  })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example: 'Categoria principal de 1x1 para adultos.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Regras específicas da categoria',
    example: 'Sistema de batalhas em chave simples, 3 rodadas.',
  })
  @IsOptional()
  @IsString()
  rules?: string;

  @ApiPropertyOptional({
    description: 'Idade mínima para participar',
    example: 16,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({
    description: 'Idade máxima para participar',
    example: 35,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxAge?: number;

  @ApiPropertyOptional({
    description: 'Nível da categoria (iniciante, intermediário, avançado)',
    example: 'AVANCADO',
  })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({
    description: 'Indica se a categoria é por equipes (crew)',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isTeam?: boolean;
}
