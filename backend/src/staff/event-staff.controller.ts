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
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EventStaffService } from './event-staff.service';
import { CreateEventStaffDto } from './dto/create-event-staff.dto';
import { UpdateEventStaffDto } from './dto/update-event-staff.dto';
import { EventStaffResponseDto } from './dto/event-staff-response.dto';
import { StaffMemberResponseDto } from './dto/staff-member-response.dto';

@ApiTags('Event Staff')
@ApiBearerAuth()
@ApiExtraModels(EventStaffResponseDto, StaffMemberResponseDto)
@Controller('events/:eventId/staff')
export class EventStaffController {
  constructor(private readonly service: EventStaffService) {}

  @Post()
  @ApiOperation({ summary: 'Vincular staff member a um evento' })
  @ApiCreatedResponse({
    description: 'Vínculo criado com sucesso',
    type: EventStaffResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou IDs inválidos' })
  @ApiConflictResponse({
    description: 'Staff member já vinculado ao evento com este papel',
  })
  @ApiNotFoundResponse({
    description: 'Evento ou staff member não encontrado',
  })
  create(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Body() dto: CreateEventStaffDto,
  ) {
    return this.service.create(eventId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar staff de um evento' })
  @ApiOkResponse({
    description: 'Lista de staff do evento retornada com sucesso',
    type: EventStaffResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'ID do evento inválido' })
  @ApiNotFoundResponse({ description: 'Evento não encontrado' })
  findAllByEvent(@Param('eventId', new ParseUUIDPipe()) eventId: string) {
    return this.service.findAllByEvent(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar vínculo de staff por id no evento' })
  @ApiOkResponse({
    description: 'Vínculo encontrado com sucesso',
    type: EventStaffResponseDto,
  })
  @ApiBadRequestResponse({ description: 'IDs inválidos' })
  @ApiNotFoundResponse({
    description: 'Evento ou vínculo de staff não encontrado',
  })
  findOne(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.findOne(eventId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vínculo de staff no evento' })
  @ApiOkResponse({
    description: 'Vínculo atualizado com sucesso',
    type: EventStaffResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou IDs inválidos' })
  @ApiConflictResponse({
    description: 'Já existe vínculo com este staff member e papel neste evento',
  })
  @ApiNotFoundResponse({
    description: 'Evento, staff member ou vínculo não encontrado',
  })
  update(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEventStaffDto,
  ) {
    return this.service.update(eventId, id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativar vínculo de staff no evento' })
  @ApiOkResponse({
    description: 'Vínculo desativado com sucesso',
    type: EventStaffResponseDto,
  })
  @ApiBadRequestResponse({ description: 'IDs inválidos' })
  @ApiNotFoundResponse({
    description: 'Evento ou vínculo de staff não encontrado',
  })
  deactivate(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.deactivate(eventId, id);
  }
}
