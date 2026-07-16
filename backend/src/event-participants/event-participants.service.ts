import {
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

    return this.prisma.eventParticipant.create({
      data: {
        eventId: dto.eventId,
        categoryId: dto.categoryId,
        athleteId: dto.athleteId,
        crewId: dto.crewId,
        status: dto.status ?? RegistrationStatus.PENDING,
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

  async cancel(id: string) {
    await this.findOne(id);

    return this.prisma.eventParticipant.update({
      where: { id },
      data: {
        isActive: false,
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
