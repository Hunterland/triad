// src/crews/dto/add-crew-member.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddCrewMemberDto {
  @ApiProperty({
    description: 'ID do atleta a ser adicionado na crew',
    example: '6e4b4e0f-0ec3-4eaa-9a66-7411a76a0f1d',
  })
  @IsString()
  athleteId!: string;

  @ApiPropertyOptional({
    description: 'Papel do atleta dentro da crew',
    example: 'Captain',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
