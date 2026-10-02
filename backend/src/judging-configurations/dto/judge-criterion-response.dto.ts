// src/judging-configurations/dto/judge-criterion-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class JudgeCriterionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  judgingConfigurationId!: string;

  @ApiProperty({
    example: 'PHYSICAL',
  })
  code!: string;

  @ApiProperty({
    example: 'Qualidade Física',
  })
  name!: string;

  @ApiProperty({
    nullable: true,
    example:
      'Avalia domínio corporal, técnica, controle, força, equilíbrio, resistência e precisão dos movimentos.',
  })
  description!: string | null;

  @ApiProperty({
    example: 33.34,
    type: Number,
    format: 'double',
  })
  weight!: number;

  @ApiProperty({
    example: 1,
  })
  order!: number;

  @ApiProperty({
    example: 0,
    type: Number,
    format: 'double',
  })
  minScore!: number;

  @ApiProperty({
    example: 10,
    type: Number,
    format: 'double',
  })
  maxScore!: number;

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
