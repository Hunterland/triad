// src/brackets/dto/create-rounds.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class CreateRoundsDto {
  @ApiProperty({
    example: 3,
    minimum: 1,
    maximum: 10,
    description:
      'Quantidade de rounds a criar para a batalha. Deve ser um número inteiro entre 1 e 10.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  quantity: number;
}
