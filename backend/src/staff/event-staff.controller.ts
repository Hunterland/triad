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
import { EventStaffService } from './event-staff.service';
import { CreateEventStaffDto } from './dto/create-event-staff.dto';
import { UpdateEventStaffDto } from './dto/update-event-staff.dto';

@ApiTags('Event Staff')
@Controller('events/:eventId/staff')
export class EventStaffController {
  constructor(private readonly service: EventStaffService) {}

  @Post()
  @ApiOperation({ summary: 'Vincular staff member a um evento' })
  @ApiCreatedResponse({ description: 'Vínculo criado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou eventId inválido' })
  @ApiConflictResponse({ description: 'Vínculo duplicado' })
  @ApiNotFoundResponse({ description: 'Evento ou staff member não encontrado' })
  create(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Body() dto: CreateEventStaffDto,
  ) {
    return this.service.create(eventId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar staff de um evento' })
  @ApiOkResponse({ description: 'Lista retornada com sucesso' })
  @ApiBadRequestResponse({ description: 'eventId inválido' })
  @ApiNotFoundResponse({ description: 'Evento não encontrado' })
  findAllByEvent(@Param('eventId', new ParseUUIDPipe()) eventId: string) {
    return this.service.findAllByEvent(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar vínculo de staff por id no evento' })
  @ApiOkResponse({ description: 'Vínculo encontrado' })
  @ApiBadRequestResponse({ description: 'eventId ou id inválido' })
  @ApiNotFoundResponse({ description: 'Evento ou vínculo não encontrado' })
  findOne(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.findOne(eventId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vínculo de staff no evento' })
  @ApiOkResponse({ description: 'Vínculo atualizado com sucesso' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos, eventId inválido ou id inválido',
  })
  @ApiConflictResponse({ description: 'Vínculo duplicado' })
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
  @ApiOkResponse({ description: 'Vínculo desativado com sucesso' })
  @ApiBadRequestResponse({ description: 'eventId inválido ou id inválido' })
  @ApiNotFoundResponse({ description: 'Evento ou vínculo não encontrado' })
  deactivate(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.deactivate(eventId, id);
  }
}
