import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StaffMembersService } from './staff-members.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { StaffMemberResponseDto } from './dto/staff-member-response.dto';

@ApiTags('Staff Members')
@ApiBearerAuth()
@Controller('staff-members')
export class StaffMembersController {
  constructor(private readonly service: StaffMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar staff member' })
  @ApiCreatedResponse({
    description: 'Staff member criado com sucesso',
    type: StaffMemberResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiConflictResponse({ description: 'Email já cadastrado' })
  create(@Body() dto: CreateStaffMemberDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar staff members' })
  @ApiOkResponse({
    description: 'Lista retornada com sucesso',
    type: StaffMemberResponseDto,
    isArray: true,
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar staff member por id' })
  @ApiOkResponse({
    description: 'Staff member encontrado',
    type: StaffMemberResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiNotFoundResponse({ description: 'Staff member não encontrado' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar staff member' })
  @ApiOkResponse({
    description: 'Staff member atualizado com sucesso',
    type: StaffMemberResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou ID inválido' })
  @ApiConflictResponse({ description: 'Email já cadastrado' })
  @ApiNotFoundResponse({ description: 'Staff member não encontrado' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateStaffMemberDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativar staff member' })
  @ApiOkResponse({
    description: 'Staff member desativado com sucesso',
    type: StaffMemberResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiNotFoundResponse({ description: 'Staff member não encontrado' })
  deactivate(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.deactivate(id);
  }
}
