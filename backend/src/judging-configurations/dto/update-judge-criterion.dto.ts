import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateJudgeCriterionDto {
  @ApiPropertyOptional({
    example: 'Qualidade Física e Técnica',
    minLength: 2,
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({
    example: 'Avalia domínio técnico, precisão, potência e controle corporal.',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @ApiPropertyOptional({
    example: 33.34,
    minimum: 0.01,
    maximum: 100,
    description:
      'Peso do critério. Deve ser maior que zero e possuir no máximo duas casas decimais.',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'weight deve ser um número com no máximo duas casas decimais.',
    },
  )
  @Min(0.01)
  @Max(100)
  weight?: number;

  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Ordem de apresentação do critério na configuração.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({
    example: 0,
    minimum: 0,
    description: 'Menor nota permitida para o critério.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minScore?: number;

  @ApiPropertyOptional({
    example: 10,
    minimum: 0,
    description: 'Maior nota permitida para o critério.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxScore?: number;
}
