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

@ApiTags('Staff Members')
@Controller('staff-members')
export class StaffMembersController {
  constructor(private readonly service: StaffMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar staff member' })
  @ApiCreatedResponse({ description: 'Staff member criado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiConflictResponse({ description: 'Email já cadastrado' })
  create(@Body() dto: CreateStaffMemberDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar staff members' })
  @ApiOkResponse({ description: 'Lista retornada com sucesso' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar staff member por id' })
  @ApiOkResponse({ description: 'Staff member encontrado' })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiNotFoundResponse({ description: 'Staff member não encontrado' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar staff member' })
  @ApiOkResponse({ description: 'Staff member atualizado com sucesso' })
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
  @ApiOkResponse({ description: 'Staff member desativado com sucesso' })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiNotFoundResponse({ description: 'Staff member não encontrado' })
  deactivate(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.deactivate(id);
  }
}
