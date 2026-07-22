// src/brackets/dto/create-bracket.dto.ts
import { IsEnum, IsUUID } from 'class-validator';
import { BracketType } from '@prisma/client';

export class CreateBracketDto {
  @IsUUID()
  eventId!: string;

  @IsUUID()
  categoryId!: string;

  @IsEnum(BracketType)
  type!: BracketType;
}
