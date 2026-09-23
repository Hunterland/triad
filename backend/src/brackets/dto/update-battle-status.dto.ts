// src/brackets/dto/update-battle-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BattleStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateBattleStatusDto {
  @ApiProperty({
    enum: BattleStatus,
    enumName: 'BattleStatus',
    example: BattleStatus.ONGOING,
    description:
      'Novo status da batalha. Transições permitidas: PENDING → ONGOING → FINISHED.',
  })
  @IsEnum(BattleStatus)
  status: BattleStatus;
}
