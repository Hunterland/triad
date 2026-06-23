// src/auth/dto/register.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'athlete1@triad.local',
    description: 'Email do usuário',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'changeme123',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    example: 'Athlete Test',
    description: 'Nome de exibição do usuário',
  })
  @IsOptional()
  @IsString()
  displayName?: string;
}
