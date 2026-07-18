// src/event-participants/event-participants.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegistrationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventParticipantDto } from './dto/create-event-participant.dto';
import { UpdateEventParticipantDto } from './dto/update-event-participant.dto';

@Injectable()
export class EventParticipantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventParticipantDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });
    if (!event) throw new NotFoundException('Evento não encontrado');

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada');

    const athlete = await this.prisma.athlete.findUnique({
      where: { id: dto.athleteId },
    });
    if (!athlete) throw new NotFoundException('Atleta não encontrado');

    if (dto.crewId) {
      const crew = await this.prisma.crew.findUnique({
        where: { id: dto.crewId },
      });

      if (!crew) throw new NotFoundException('Crew não encontrada');
    }

    const existing = await this.prisma.eventParticipant.findUnique({
      where: {
        eventId_categoryId_athleteId: {
          eventId: dto.eventId,
          categoryId: dto.categoryId,
          athleteId: dto.athleteId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Atleta já está inscrito nesta categoria para este evento',
      );
    }

    // Força inscrição nascer como PENDING (fluxo natural da US3.x)
    return this.prisma.eventParticipant.create({
      data: {
        eventId: dto.eventId,
        categoryId: dto.categoryId,
        athleteId: dto.athleteId,
        crewId: dto.crewId,
        status: RegistrationStatus.PENDING,
      },
      include: {
        event: true,
        category: true,
        athlete: true,
        crew: true,
      },
    });
  }

  async findAll() {
    return this.prisma.eventParticipant.findMany({
      include: {
        event: true,
        category: true,
        athlete: true,
        crew: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const participant = await this.prisma.eventParticipant.findUnique({
      where: { id },
      include: {
        event: true,
        category: true,
        athlete: true,
        crew: true,
      },
    });

    if (!participant) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    return participant;
  }

  async update(id: string, dto: UpdateEventParticipantDto) {
    // Garante que existe
    await this.findOne(id);

    if (dto.crewId) {
      const crew = await this.prisma.crew.findUnique({
        where: { id: dto.crewId },
      });

      if (!crew) throw new NotFoundException('Crew não encontrada');
    }

    return this.prisma.eventParticipant.update({
      where: { id },
      data: {
        status: dto.status,
        isActive: dto.isActive,
        crewId: dto.crewId,
      },
      include: {
        event: true,
        category: true,
        athlete: true,
        crew: true,
      },
    });
  }

  /**
   * Aprovar inscrição
   */
  async approve(id: string) {
    const registration = await this.prisma.eventParticipant.findUnique({
      where: { id },
      include: {
        event: true,
        category: true,
      },
    });

    if (!registration) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    // Estado atual
    if (registration.status === RegistrationStatus.APPROVED) {
      throw new ConflictException('Inscrição já está aprovada');
    }

    if (registration.status === RegistrationStatus.REJECTED) {
      throw new ConflictException(
        'Inscrição já foi rejeitada e não pode ser aprovada',
      );
    }

    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new ConflictException('Inscrição cancelada não pode ser aprovada');
    }

    // Regras de negócio adicionais (evento/categoria ativos)
    if (!registration.event.isActive) {
      throw new BadRequestException(
        'Não é possível aprovar inscrição de evento inativo',
      );
    }

    if (!registration.category.isActive) {
      throw new BadRequestException(
        'Não é possível aprovar inscrição de categoria inativa',
      );
    }

    return this.prisma.eventParticipant.update({
      where: { id },
      data: {
        status: RegistrationStatus.APPROVED,
      },
      include: {
        event: true,
        category: true,
        athlete: true,
        crew: true,
      },
    });
  }

  /**
   * Reprovar inscrição
   */
  async reject(id: string) {
    const registration = await this.prisma.eventParticipant.findUnique({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    if (registration.status === RegistrationStatus.APPROVED) {
      throw new ConflictException(
        'Inscrição já aprovada não pode ser rejeitada',
      );
    }

    if (registration.status === RegistrationStatus.REJECTED) {
      throw new ConflictException('Inscrição já está rejeitada');
    }

    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new ConflictException('Inscrição cancelada não pode ser rejeitada');
    }

    return this.prisma.eventParticipant.update({
      where: { id },
      data: {
        status: RegistrationStatus.REJECTED,
      },
      include: {
        event: true,
        category: true,
        athlete: true,
        crew: true,
      },
    });
  }

  /**
   * Cancelar inscrição
   */
  async cancel(id: string) {
    const registration = await this.prisma.eventParticipant.findUnique({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new ConflictException('Inscrição já está cancelada');
    }

    // Regra simples: só permite cancelar PENDING ou APPROVED
    if (
      registration.status !== RegistrationStatus.PENDING &&
      registration.status !== RegistrationStatus.APPROVED
    ) {
      throw new ConflictException(
        'Somente inscrições pendentes ou aprovadas podem ser canceladas',
      );
    }

    return this.prisma.eventParticipant.update({
      where: { id },
      data: {
        status: RegistrationStatus.CANCELLED,
      },
      include: {
        event: true,
        category: true,
        athlete: true,
        crew: true,
      },
    });
  }
}
