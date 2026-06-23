// src/users/dto/update-user.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'TRIAD Admin Updated',
    description: 'Nome de exibição do usuário',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o usuário está ativo',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
