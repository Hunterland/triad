import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStaffMemberDto {
  @ApiProperty({
    example: 'Carlos Eduardo',
    description: 'Nome completo do membro de staff',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({
    example: 'B-Boy Cadu',
    description: 'Nome artístico ou nome de exibição',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  stageName?: string;

  @ApiPropertyOptional({
    example: 'cadu@email.com',
    description: 'E-mail do membro de staff',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+55 21 99999-9999',
    description: 'Telefone para contato',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Brasil',
    description: 'País de origem',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({
    example: 'Rio de Janeiro',
    description: 'Cidade de origem',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  city?: string;

  @ApiPropertyOptional({
    example: '12345678900',
    description: 'Documento de identificação do staff member',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  documentId?: string;

  @ApiProperty({
    enum: StaffRole,
    example: StaffRole.JUDGE,
    description: 'Papel principal padrão do staff member no sistema',
  })
  @IsEnum(StaffRole)
  defaultRole!: StaffRole;

  @ApiPropertyOptional({
    example: 'breaking',
    description: 'Especialidade principal do staff member',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  specialty?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Indica se o staff member está ativo no sistema',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
