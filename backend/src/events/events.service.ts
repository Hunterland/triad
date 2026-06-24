import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Event } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

/**
 * Serviço responsável pelo gerenciamento de eventos.
 *
 * Responsabilidades:
 * - Criar eventos;
 * - Listar eventos;
 * - Buscar um evento por ID;
 * - Atualizar eventos;
 * - Desativar eventos (soft delete);
 * - Validar regras de negócio relacionadas às datas;
 * - Garantir unicidade do slug.
 */
@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo evento.
   *
   * Fluxo:
   * 1. Verifica se já existe um evento com o mesmo slug.
   * 2. Converte as datas recebidas.
   * 3. Valida o intervalo entre startDate e endDate.
   * 4. Persiste o evento no banco.
   *
   * @param dto Dados recebidos para criação do evento.
   * @returns Evento criado.
   * @throws ConflictException Caso já exista um evento com o mesmo slug.
   * @throws BadRequestException Caso endDate seja menor que startDate.
   */
  async create(dto: CreateEventDto): Promise<Event> {
    const existing: Event | null = await this.prisma.event.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Já existe um evento com este slug');
    }

    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : null;

    this.validateDateRange(startDate, endDate);

    return await this.prisma.event.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        location: dto.location,
        startDate,
        endDate,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Lista todos os eventos ordenados pela data de início.
   *
   * @returns Lista de eventos.
   */
  async findAll(): Promise<Event[]> {
    return await this.prisma.event.findMany({
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  /**
   * Busca um evento pelo ID.
   *
   * @param id Identificador do evento.
   * @returns Evento encontrado.
   * @throws NotFoundException Caso o evento não exista.
   */
  async findOne(id: string): Promise<Event> {
    const event: Event | null = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  /**
   * Atualiza um evento existente.
   *
   * Fluxo:
   * 1. Garante que o evento existe.
   * 2. Verifica se o novo slug já está sendo utilizado.
   * 3. Calcula as próximas datas (mantendo as atuais caso não sejam enviadas).
   * 4. Valida o intervalo entre as datas.
   * 5. Atualiza o registro.
   *
   * @param id Identificador do evento.
   * @param dto Dados para atualização.
   * @returns Evento atualizado.
   *
   * @throws NotFoundException Caso o evento não exista.
   * @throws ConflictException Caso outro evento já possua o mesmo slug.
   * @throws BadRequestException Caso endDate seja menor que startDate.
   */
  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const currentEvent = await this.ensureExists(id);

    if (dto.slug) {
      const existing: Event | null = await this.prisma.event.findUnique({
        where: { slug: dto.slug },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Já existe um evento com este slug');
      }
    }

    // Mantém a data atual caso startDate não seja enviado.
    const nextStartDate = dto.startDate
      ? new Date(dto.startDate)
      : currentEvent.startDate;

    // Permite atualizar, remover ou manter a data final.
    const nextEndDate =
      dto.endDate !== undefined
        ? dto.endDate
          ? new Date(dto.endDate)
          : null
        : currentEvent.endDate;

    this.validateDateRange(nextStartDate, nextEndDate);

    return await this.prisma.event.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        location: dto.location,

        // Atualiza apenas se um valor tiver sido enviado
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,

        // Permite remover a data final atribuindo null
        endDate:
          dto.endDate !== undefined
            ? dto.endDate
              ? new Date(dto.endDate)
              : null
            : undefined,

        isActive: dto.isActive,
      },
    });
  }

  /**
   * Realiza uma desativação lógica (soft delete).
   *
   * Não remove o evento do banco, apenas altera o campo isActive para false.
   *
   * @param id Identificador do evento.
   * @returns Evento desativado.
   * @throws NotFoundException Caso o evento não exista.
   */
  async deactivate(id: string): Promise<Event> {
    await this.ensureExists(id);

    return await this.prisma.event.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Garante que um evento exista no banco.
   *
   * Método auxiliar utilizado para evitar repetição de código.
   *
   * @param id Identificador do evento.
   * @returns Evento encontrado.
   * @throws NotFoundException Caso o evento não exista.
   */
  private async ensureExists(id: string): Promise<Event> {
    const event: Event | null = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  /**
   * Valida o intervalo entre as datas.
   *
   * Regra de negócio:
   * - endDate deve ser maior ou igual a startDate.
   * - Caso endDate seja nulo, nenhuma validação é necessária.
   *
   * @param startDate Data inicial do evento.
   * @param endDate Data final do evento.
   *
   * @throws BadRequestException Caso a data final seja menor que a inicial.
   */
  private validateDateRange(startDate: Date, endDate: Date | null): void {
    if (!endDate) {
      return;
    }

    if (endDate.getTime() < startDate.getTime()) {
      throw new BadRequestException(
        'endDate deve ser maior ou igual a startDate',
      );
    }
  }
}
