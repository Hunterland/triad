// src/event-participants/event-participants.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateEventParticipantDto } from './dto/create-event-participant.dto';
import { UpdateEventParticipantDto } from './dto/update-event-participant.dto';
import { EventParticipantsService } from './event-participants.service';
import { EventParticipantResponseDto } from './dto/event-participant-response.dto';

@ApiTags('event-participants')
@ApiBearerAuth('Bearer')
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
@ApiForbiddenResponse({ description: 'Usuário autenticado sem permissão' })
@Controller('event-participants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventParticipantsController {
  constructor(
    private readonly eventParticipantsService: EventParticipantsService,
  ) {}

  @ApiOperation({ summary: 'Criar inscrição' })
  @ApiConflictResponse({
    description: 'Atleta já está inscrito nesta categoria para este evento',
  })
  @ApiNotFoundResponse({
    description: 'Evento, categoria, atleta ou crew não encontrada',
  })
  @ApiOkResponse({ type: EventParticipantResponseDto })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Post()
  create(@Body() dto: CreateEventParticipantDto) {
    return this.eventParticipantsService.create(dto);
  }

  @ApiOperation({ summary: 'Listar inscrições' })
  @ApiOkResponse({
    description: 'Lista de inscrições',
    type: EventParticipantResponseDto,
    isArray: true,
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get()
  findAll() {
    return this.eventParticipantsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar inscrição por ID' })
  @ApiNotFoundResponse({ description: 'Inscrição não encontrada' })
  @ApiOkResponse({ type: EventParticipantResponseDto })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventParticipantsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar inscrição' })
  @ApiNotFoundResponse({ description: 'Inscrição não encontrada' })
  @ApiOkResponse({ type: EventParticipantResponseDto })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventParticipantDto) {
    return this.eventParticipantsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Aprovar inscrição' })
  @ApiNotFoundResponse({ description: 'Inscrição não encontrada' })
  @ApiConflictResponse({
    description: 'Inscrição em estado inválido para aprovação',
  })
  @ApiBadRequestResponse({
    description: 'Evento ou categoria inativos',
  })
  @ApiOkResponse({ type: EventParticipantResponseDto })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.eventParticipantsService.approve(id);
  }

  @ApiOperation({ summary: 'Reprovar inscrição' })
  @ApiNotFoundResponse({ description: 'Inscrição não encontrada' })
  @ApiConflictResponse({
    description: 'Inscrição em estado inválido para reprovação',
  })
  @ApiOkResponse({ type: EventParticipantResponseDto })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.eventParticipantsService.reject(id);
  }

  @ApiOperation({ summary: 'Cancelar inscrição' })
  @ApiNotFoundResponse({ description: 'Inscrição não encontrada' })
  @ApiConflictResponse({
    description: 'Inscrição em estado inválido para cancelamento',
  })
  @ApiOkResponse({ type: EventParticipantResponseDto })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.eventParticipantsService.cancel(id);
  }
}
