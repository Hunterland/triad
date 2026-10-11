import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoundStatus } from '@prisma/client';

export class UpdateRoundStatusDto {
  @ApiProperty({
    enum: RoundStatus,
    example: RoundStatus.ONGOING,
  })
  @IsEnum(RoundStatus)
  status!: RoundStatus;
}
