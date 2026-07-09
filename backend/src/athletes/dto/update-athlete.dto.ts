// src/athletes/dto/update-athlete.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAthleteDto {
  @ApiPropertyOptional({
    description: 'Nome completo do atleta',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Stage name',
  })
  @IsOptional()
  @IsString()
  stageName?: string;

  @ApiPropertyOptional({
    description: 'Email do atleta',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone de contato',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'País',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Cidade',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'ID de usuário vinculado',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Indica se o atleta está ativo',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
