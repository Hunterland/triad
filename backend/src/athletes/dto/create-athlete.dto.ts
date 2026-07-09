// src/athletes/dto/create-athlete.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAthleteDto {
  @ApiProperty({
    description: 'Nome completo do atleta',
    example: 'João Silva',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Nome artístico / stage name',
    example: 'BBoy Flux',
  })
  @IsOptional()
  @IsString()
  stageName?: string;

  @ApiPropertyOptional({
    description: 'Email do atleta (opcional, mas único)',
    example: 'bboy.flux@exemplo.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone de contato',
    example: '+55 11 99999-0000',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'País',
    example: 'Brasil',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento',
    example: '1998-05-12',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'ID de usuário vinculado (se houver conta TRIAD)',
    example: 'b4305d4d-6b1d-45b2-a5dc-9dcafbc679fc',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
