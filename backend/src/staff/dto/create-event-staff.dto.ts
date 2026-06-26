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
  @ApiProperty({ example: '4d0d4b4e-7c44-4db1-8ea3-bfd17624f111' })
  @IsUUID()
  staffMemberId: string;

  @ApiProperty({ enum: StaffRole, example: StaffRole.JUDGE })
  @IsEnum(StaffRole)
  role: StaffRole;

  @ApiPropertyOptional({ example: '1x1 Breaking Pro' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isLead?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
