// src/crews/dto/create-crew.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCrewDto {
  @ApiProperty({
    description: 'Nome da crew',
    example: 'Dream Flow Crew',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Cidade da crew',
    example: 'São Paulo',
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
}
