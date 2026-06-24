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

/**
 * Controller responsável pelo gerenciamento dos eventos.
 *
 * Responsabilidades:
 * - Expor endpoints HTTP relacionados aos eventos;
 * - Aplicar autenticação e autorização através dos Guards;
 * - Delegar regras de negócio ao EventsService;
 * - Documentar os endpoints utilizando Swagger.
 *
 * Segurança:
 * - Todas as rotas exigem JWT válido;
 * - Apenas usuários ADMIN e ORGANIZER podem acessar os recursos.
 */
@ApiTags('events')
@ApiBearerAuth('Bearer')
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado',
})
@ApiForbiddenResponse({
  description: 'Usuário autenticado sem permissão para acessar este recurso',
})
@Controller('events')
/**
 * JwtAuthGuard:
 * Valida se o usuário está autenticado.
 *
 * RolesGuard:
 * Verifica se o usuário possui uma das roles exigidas
 * pelo decorator @Roles().
 */
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  /**
   * Serviço responsável pelas regras de negócio dos eventos.
   * O controller apenas recebe as requisições e delega
   * o processamento para o service.
   */
  constructor(private readonly eventsService: EventsService) {}
  /**
   * Cria um novo evento.
   *
   * Endpoint:
   * POST /events
   *
   * Fluxo:
   * 1. Recebe os dados do corpo da requisição.
   * 2. O JwtAuthGuard valida o token.
   * 3. O RolesGuard verifica se o usuário é ADMIN ou ORGANIZER.
   * 4. O EventsService realiza as validações e persiste o evento.
   * 5. Retorna o evento criado.
   *
   * @param dto Dados do evento recebidos no body.
   * @returns Evento criado.
   */
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
  @Post()
  async create(@Body() dto: CreateEventDto): Promise<Event> {
    return await this.eventsService.create(dto);
  }

  /**
   * Lista todos os eventos cadastrados.
   *
   * Endpoint:
   * GET /events
   *
   * Fluxo:
   * 1. Verifica autenticação e autorização.
   * 2. Solicita ao EventsService todos os eventos.
   * 3. Retorna a coleção de eventos.
   *
   * @returns Lista de eventos.
   */
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
  /**
   * Busca um evento através do seu identificador.
   *
   * Endpoint:
   * GET /events/:id
   *
   * @param id ID do evento.
   * @returns Evento encontrado.
   *
   * Pode lançar:
   * - NotFoundException caso o evento não exista.
   */
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
  /**
   * Atualiza parcialmente um evento existente.
   *
   * Endpoint:
   * PATCH /events/:id
   *
   * Observação:
   * Apenas os campos enviados no DTO serão alterados.
   *
   * @param id Identificador do evento.
   * @param dto Dados para atualização.
   * @returns Evento atualizado.
   *
   * Pode lançar:
   * - NotFoundException;
   * - ConflictException.
   */
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
  /**
   * Realiza uma desativação lógica (soft delete).
   *
   * Endpoint:
   * PATCH /events/:id/deactivate
   *
   * Importante:
   * O registro não é removido do banco.
   * Apenas o campo isActive é alterado para false.
   *
   * @param id Identificador do evento.
   * @returns Evento desativado.
   */
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
