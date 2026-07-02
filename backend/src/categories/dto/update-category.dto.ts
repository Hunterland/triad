// src/categories/dto/update-category.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Min } from 'class-validator';
import { IsInt } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Nome da categoria',
    example: 'Breaking 1x1 Adulto Masculino - Pro',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Slug único da categoria dentro do evento',
    example: 'breaking-1x1-adulto-masculino-pro',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example: 'Categoria principal para atletas profissionais.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Regras específicas da categoria',
    example: 'Sistema de batalhas com repescagem.',
  })
  @IsOptional()
  @IsString()
  rules?: string;

  @ApiPropertyOptional({
    description: 'Idade mínima para participar',
    example: 18,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({
    description: 'Idade máxima para participar',
    example: 40,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxAge?: number;

  @ApiPropertyOptional({
    description: 'Nível da categoria',
    example: 'PRO',
  })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({
    description: 'Indica se a categoria é por equipes',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isTeam?: boolean;

  @ApiPropertyOptional({
    description: 'Indica se a categoria está ativa',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
