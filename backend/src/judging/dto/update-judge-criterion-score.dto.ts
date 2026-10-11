import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateJudgeCriterionScoreDto {
  @ApiProperty({
    description: 'Nova nota atribuída ao critério',
    example: 8.75,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'A nota deve ser um número com no máximo duas casas decimais.',
    },
  )
  @Min(0)
  @Max(10)
  score!: number;
}
