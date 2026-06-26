import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';

export class StaffMemberResponseDto {
  @ApiProperty({
    example: '48838c6b-399c-4a49-96f8-f41ea17a374e',
    description: 'ID do membro de staff',
  })
  id!: string;

  @ApiProperty({
    example: 'Alan Barroncas',
    description: 'Nome completo do membro de staff',
  })
  name!: string;

  @ApiPropertyOptional({
    example: 'B-Boy Hunter',
    description: 'Nome artístico ou nome de exibição',
  })
  stageName?: string;

  @ApiPropertyOptional({
    example: 'alanbarroncas@gmail.com',
    description: 'E-mail do membro de staff',
  })
  email?: string;

  @ApiPropertyOptional({
    example: '+55 92 993818973',
    description: 'Telefone para contato',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Brasil',
    description: 'País de origem',
  })
  country?: string;

  @ApiPropertyOptional({
    example: 'Manaus',
    description: 'Cidade de origem',
  })
  city?: string;

  @ApiPropertyOptional({
    example: '26585596',
    description: 'Documento de identificação',
  })
  documentId?: string;

  @ApiProperty({
    enum: StaffRole,
    example: StaffRole.JUDGE,
    description: 'Papel principal padrão do membro de staff',
  })
  defaultRole!: StaffRole;

  @ApiPropertyOptional({
    example: 'breaking',
    description: 'Especialidade principal',
  })
  specialty?: string;

  @ApiProperty({
    example: true,
    description: 'Indica se o membro de staff está ativo',
  })
  isActive!: boolean;

  @ApiProperty({
    example: '2026-06-26T06:30:31.808Z',
    description: 'Data de criação do registro',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-26T06:33:37.480Z',
    description: 'Data da última atualização do registro',
  })
  updatedAt!: Date;
}
