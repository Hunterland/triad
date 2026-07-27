import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindBracketViewDto {
  @ApiProperty({
    example: 'ebf63b0c-e2d4-4178-a7b6-755b44584faa',
    description: 'ID do evento',
  })
  @IsUUID()
  eventId!: string;

  @ApiProperty({
    example: '4a47b7d5-3945-4d60-9cb1-8e9b5b7e2df1',
    description: 'ID da categoria',
  })
  @IsUUID()
  categoryId!: string;
}
