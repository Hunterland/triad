import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CreateJudgeCriterionScoreDto {
  @ApiProperty({
    description: 'ID do competidor da batalha (RED ou BLUE)',
    example: 'uuid-do-competidor-red',
  })
  @IsUUID()
  battleCompetitorId!: string;

  @ApiProperty({
    description: 'ID do critério ativo da configuração TRIAD publicada',
    example: '57325456-3679-4481-a470-2ff533a2668a',
  })
  @IsUUID()
  judgeCriterionId!: string;

  @ApiProperty({
    description: 'Nota atribuída ao competidor para o critério',
    example: 8.5,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;
}
