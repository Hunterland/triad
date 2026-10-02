// src/judging-configurations/dto/create-judge-criterion.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateJudgeCriterionDto {
  @ApiProperty({
    example: 'PHYSICAL',
    description:
      'Código técnico único do critério dentro da configuração. Use letras maiúsculas e underscore.',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({
    example: 'Qualidade Física',
    description: 'Nome que será exibido na interface do jurado.',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    example:
      'Avalia domínio corporal, técnica, controle, força, equilíbrio, resistência e precisão dos movimentos.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 33.34,
    minimum: 0.01,
    maximum: 100,
    description:
      'Peso do critério na composição do resultado. A soma dos pesos será validada na publicação.',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  weight!: number;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Ordem de exibição do critério na interface do jurado.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order!: number;

  @ApiProperty({
    example: 0,
    minimum: 0,
    required: false,
    default: 0,
    description: 'Menor nota permitida para o critério.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minScore?: number;

  @ApiProperty({
    example: 10,
    minimum: 0.01,
    required: false,
    default: 10,
    description:
      'Maior nota permitida para o critério. Deve ser maior que minScore.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  maxScore?: number;
}
