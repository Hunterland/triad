// src/judging-configurations/dto/create-judging-configuration.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { JudgingInterfaceType, JudgingPurpose } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJudgingConfigurationDto {
  @ApiProperty({
    example: 'TRIAD Batalha — Breaking Top 8',
    description: 'Nome administrativo da configuração de julgamento.',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    enum: JudgingInterfaceType,
    enumName: 'JudgingInterfaceType',
    example: JudgingInterfaceType.TRIAD,
    description: 'Define o tipo de interface futura exibida ao jurado.',
  })
  @IsEnum(JudgingInterfaceType)
  interfaceType!: JudgingInterfaceType;

  @ApiProperty({
    enum: JudgingPurpose,
    enumName: 'JudgingPurpose',
    example: JudgingPurpose.BATTLE,
    description:
      'Define se a configuração será usada em batalhas ou pré-seleção.',
    required: false,
    default: JudgingPurpose.BATTLE,
  })
  @IsEnum(JudgingPurpose)
  purpose?: JudgingPurpose;
}
