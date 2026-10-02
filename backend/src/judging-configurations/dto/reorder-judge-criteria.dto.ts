import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class ReorderJudgeCriteriaDto {
  @ApiProperty({
    description:
      'IDs de todos os critérios ativos, na ordem final desejada. O primeiro receberá ordem 1.',
    example: [
      'f4c87b4e-2250-4e83-85c7-55b67d1a1df0',
      '1f7283f9-0b26-4a03-8a4d-d98a0b695bcc',
      '3da9f283-35e5-4803-ba59-1a5d01f36199',
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  criterionIds: string[];
}
