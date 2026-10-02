import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateJudgingConfigurationVersionDto {
  @ApiPropertyOptional({
    description:
      'Nome opcional da nova versão. Se omitido, será usado o nome da configuração de origem com o sufixo da versão.',
    example: 'TRIAD Batalha — Breaking Top 8 — V2',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  name?: string;
}
