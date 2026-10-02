// src/judging-configurations/dto/judging-configuration-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  JudgingConfigurationStatus,
  JudgingInterfaceType,
  JudgingPurpose,
} from '@prisma/client';

export class JudgingConfigurationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    enum: JudgingInterfaceType,
    enumName: 'JudgingInterfaceType',
  })
  interfaceType!: JudgingInterfaceType;

  @ApiProperty({
    enum: JudgingPurpose,
    enumName: 'JudgingPurpose',
  })
  purpose!: JudgingPurpose;

  @ApiProperty({
    enum: JudgingConfigurationStatus,
    enumName: 'JudgingConfigurationStatus',
  })
  status!: JudgingConfigurationStatus;

  @ApiProperty({
    example: 1,
    description:
      'Número de versão da configuração para a categoria e finalidade.',
  })
  version!: number;

  @ApiProperty()
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
