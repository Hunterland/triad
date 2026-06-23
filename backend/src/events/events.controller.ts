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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Event, RoleName } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('events')
@ApiBearerAuth('Bearer')
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado',
})
@ApiForbiddenResponse({
  description: 'Usuário autenticado sem permissão para acessar este recurso',
})
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Criar evento' })
  @ApiCreatedResponse({
    description: 'Evento criado com sucesso',
    schema: {
      example: {
        id: 'b4305d4d-6b1d-45b2-a5dc-9dcafbc679fc',
        name: 'TRIAD Battle Finals 2026',
        slug: 'triad-battle-finals-2026',
        description: 'Etapa final do circuito TRIAD 2026.',
        location: 'São Paulo - SP',
        startDate: '2026-09-20T14:00:00.000Z',
        endDate: '2026-09-20T22:00:00.000Z',
        isActive: true,
        createdAt: '2026-06-23T07:55:07.597Z',
        updatedAt: '2026-06-23T07:55:07.597Z',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Já existe um evento com este slug',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Post()
  async create(@Body() dto: CreateEventDto): Promise<Event> {
    return await this.eventsService.create(dto);
  }

  @ApiOperation({ summary: 'Listar eventos' })
  @ApiOkResponse({
    description: 'Lista de eventos cadastrados',
    schema: {
      example: [
        {
          id: 'b4305d4d-6b1d-45b2-a5dc-9dcafbc679fc',
          name: 'TRIAD Battle Finals 2026',
          slug: 'triad-battle-finals-2026',
          description: 'Etapa final do circuito TRIAD 2026.',
          location: 'São Paulo - SP',
          startDate: '2026-09-20T14:00:00.000Z',
          endDate: '2026-09-20T22:00:00.000Z',
          isActive: true,
          createdAt: '2026-06-23T07:55:07.597Z',
          updatedAt: '2026-06-23T07:55:07.597Z',
        },
      ],
    },
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get()
  async findAll(): Promise<Event[]> {
    return await this.eventsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar evento por ID' })
  @ApiOkResponse({
    description: 'Evento encontrado com sucesso',
    schema: {
      example: {
        id: 'b4305d4d-6b1d-45b2-a5dc-9dcafbc679fc',
        name: 'TRIAD Battle Finals 2026',
        slug: 'triad-battle-finals-2026',
        description: 'Etapa final do circuito TRIAD 2026.',
        location: 'São Paulo - SP',
        startDate: '2026-09-20T14:00:00.000Z',
        endDate: '2026-09-20T22:00:00.000Z',
        isActive: true,
        createdAt: '2026-06-23T07:55:07.597Z',
        updatedAt: '2026-06-23T07:55:07.597Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Evento não encontrado',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return await this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar evento' })
  @ApiOkResponse({
    description: 'Evento atualizado com sucesso',
    schema: {
      example: {
        id: 'b4305d4d-6b1d-45b2-a5dc-9dcafbc679fc',
        name: 'TRIAD Battle Finals 2026 - Updated',
        slug: 'triad-battle-finals-2026',
        description: 'Etapa final do circuito TRIAD 2026 com ajustes.',
        location: 'São Paulo - SP',
        startDate: '2026-09-20T14:00:00.000Z',
        endDate: '2026-09-20T23:00:00.000Z',
        isActive: true,
        createdAt: '2026-06-23T07:55:07.597Z',
        updatedAt: '2026-06-23T08:10:00.000Z',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Já existe um evento com este slug',
  })
  @ApiNotFoundResponse({
    description: 'Evento não encontrado',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<Event> {
    return await this.eventsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Desativar evento' })
  @ApiOkResponse({
    description: 'Evento desativado com sucesso',
    schema: {
      example: {
        id: 'b4305d4d-6b1d-45b2-a5dc-9dcafbc679fc',
        name: 'TRIAD Battle Finals 2026',
        slug: 'triad-battle-finals-2026',
        description: 'Etapa final do circuito TRIAD 2026.',
        location: 'São Paulo - SP',
        startDate: '2026-09-20T14:00:00.000Z',
        endDate: '2026-09-20T22:00:00.000Z',
        isActive: false,
        createdAt: '2026-06-23T07:55:07.597Z',
        updatedAt: '2026-06-23T08:15:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Evento não encontrado',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<Event> {
    return await this.eventsService.deactivate(id);
  }
}
