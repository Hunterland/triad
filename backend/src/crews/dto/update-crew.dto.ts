// src/crews/dto/update-crew.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCrewDto {
  @ApiPropertyOptional({
    description: 'Nome da crew',
    example: 'Dream Flow Crew Elite',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Cidade da crew',
    example: 'Rio de Janeiro',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'País da crew',
    example: 'Brasil',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Indica se a crew está ativa',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
