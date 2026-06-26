import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';
import { StaffMemberResponseDto } from '../../staff/dto/staff-member-response.dto';

class EventSummaryResponseDto {
  @ApiProperty({
    example: '4a496b6a-69d7-40a4-8538-8d91a8ed798a',
    description: 'ID do evento',
  })
  id!: string;

  @ApiProperty({
    example: 'TRIAD Battle Finals 2026',
    description: 'Nome do evento',
  })
  name!: string;

  @ApiProperty({
    example: 'triad-battle-finals-2026',
    description: 'Slug único do evento',
  })
  slug!: string;

  @ApiPropertyOptional({
    example: 'Etapa final do circuito TRIAD 2026.',
    description: 'Descrição do evento',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 'São Paulo - SP',
    description: 'Local do evento',
  })
  location?: string;

  @ApiProperty({
    example: '2026-09-20T14:00:00.000Z',
    description: 'Data e hora de início do evento',
  })
  startDate!: Date;

  @ApiProperty({
    example: '2026-09-20T22:00:00.000Z',
    description: 'Data e hora de encerramento do evento',
  })
  endDate!: Date;

  @ApiProperty({
    example: true,
    description: 'Indica se o evento está ativo',
  })
  isActive!: boolean;

  @ApiProperty({
    example: '2026-06-23T07:54:57.301Z',
    description: 'Data de criação do evento',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-23T19:34:40.503Z',
    description: 'Data da última atualização do evento',
  })
  updatedAt!: Date;
}

export class EventStaffResponseDto {
  @ApiProperty({
    example: '228fb889-9f60-4917-9e62-471e41d41df1',
    description: 'ID do vínculo entre evento e staff',
  })
  id!: string;

  @ApiProperty({
    example: '4a496b6a-69d7-40a4-8538-8d91a8ed798a',
    description: 'ID do evento',
  })
  eventId!: string;

  @ApiProperty({
    example: '48838c6b-399c-4a49-96f8-f41ea17a374e',
    description: 'ID do membro de staff',
  })
  staffMemberId!: string;

  @ApiProperty({
    enum: StaffRole,
    example: StaffRole.JUDGE,
    description: 'Papel do staff no evento',
  })
  role!: StaffRole;

  @ApiPropertyOptional({
    example: '1x1 Breaking Pro',
    description: 'Área, categoria ou contexto de atuação no evento',
  })
  area?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Ordem de prioridade, exibição ou composição',
  })
  order?: number;

  @ApiProperty({
    example: false,
    description: 'Indica se é o responsável principal naquele papel',
  })
  isLead!: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica se o vínculo está ativo',
  })
  isActive!: boolean;

  @ApiProperty({
    example: '2026-06-26T06:53:45.405Z',
    description: 'Data de criação do vínculo',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-26T07:04:50.626Z',
    description: 'Data da última atualização do vínculo',
  })
  updatedAt!: Date;

  @ApiProperty({
    type: EventSummaryResponseDto,
    description: 'Resumo do evento vinculado',
  })
  event!: EventSummaryResponseDto;

  @ApiProperty({
    type: StaffMemberResponseDto,
    description: 'Dados do membro de staff vinculado',
  })
  staffMember!: StaffMemberResponseDto;
}
