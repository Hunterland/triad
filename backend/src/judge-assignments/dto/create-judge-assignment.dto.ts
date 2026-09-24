import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateJudgeAssignmentDto {
  @ApiProperty({
    description:
      'ID do vínculo ativo EventStaff do juiz no evento da categoria.',
    example: 'a35c6e8d-7c31-4f99-a1c4-c4158d5c0b3f',
  })
  @IsUUID()
  eventStaffId!: string;
}
