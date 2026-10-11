import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateJudgeCriterionScoreDto } from './create-judge-criterion-score.dto';
import { JudgeScorecardStatus } from '@prisma/client';

export class CreateJudgeScorecardDto {
  @ApiProperty({
    description: 'ID da atribuição ativa do juiz na categoria da batalha',
    example: 'd5a5a0ed-eae9-451e-9a69-355e746fd773',
  })
  @IsUUID()
  judgeAssignmentId!: string;

  @ApiProperty({
    description: 'ID da configuração de julgamento TRIAD publicada',
    example: '080b9717-e690-43fa-8fdb-4bc55f04f410',
  })
  @IsUUID()
  judgingConfigurationId!: string;

  @ApiProperty({
    description: 'Notas iniciais por competidor e critério',
    type: [CreateJudgeCriterionScoreDto],
    example: [
      {
        battleCompetitorId: 'uuid-do-competidor-red',
        judgeCriterionId: '57325456-3679-4481-a470-2ff533a2668a',
        score: 8.5,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateJudgeCriterionScoreDto)
  criterionScores!: CreateJudgeCriterionScoreDto[];

  @ApiPropertyOptional({
    description: 'Status inicial do scorecard',
    enum: JudgeScorecardStatus,
    default: JudgeScorecardStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(JudgeScorecardStatus)
  status?: JudgeScorecardStatus = JudgeScorecardStatus.DRAFT;
}
