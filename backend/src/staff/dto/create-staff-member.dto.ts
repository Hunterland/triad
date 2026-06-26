import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStaffMemberDto {
  @ApiProperty({ example: 'Carlos Eduardo' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'B-Boy Cadu' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  stageName?: string;

  @ApiPropertyOptional({ example: 'cadu@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+55 21 99999-9999' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'Brasil' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: 'Rio de Janeiro' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @ApiPropertyOptional({ example: '12345678900' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  documentId?: string;

  @ApiProperty({ enum: StaffRole, example: StaffRole.JUDGE })
  @IsEnum(StaffRole)
  defaultRole: StaffRole;

  @ApiPropertyOptional({ example: 'breaking' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  specialty?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
