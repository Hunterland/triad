import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEventStaffDto {
  @ApiProperty({
    example: '48838c6b-399c-4a49-96f8-f41ea17a374e',
    description: 'ID do staff member que será vinculado ao evento',
  })
  @IsUUID('4')
  staffMemberId!: string;

  @ApiProperty({
    enum: StaffRole,
    example: StaffRole.JUDGE,
    description: 'Papel do staff member no evento',
  })
  @IsEnum(StaffRole)
  role!: StaffRole;

  @ApiPropertyOptional({
    example: '1x1 Breaking Pro',
    description: 'Área, categoria ou contexto em que o staff atuará no evento',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Ordem de exibição ou prioridade do staff dentro do papel',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Indica se o staff member é o principal naquele papel',
  })
  @IsOptional()
  @IsBoolean()
  isLead?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Indica se o vínculo será criado como ativo',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
