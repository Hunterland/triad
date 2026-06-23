// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@triad.local',
    description: 'Email do usuário',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'changeme',
    description: 'Senha do usuário',
  })
  @IsString()
  password!: string;
}
