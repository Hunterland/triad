import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Event } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const existing: Event | null = await this.prisma.event.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Já existe um evento com este slug');
    }

    return await this.prisma.event.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        location: dto.location,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(): Promise<Event[]> {
    return await this.prisma.event.findMany({
      orderBy: { startDate: 'asc' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event: Event | null = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    await this.ensureExists(id);

    if (dto.slug) {
      const existing: Event | null = await this.prisma.event.findUnique({
        where: { slug: dto.slug },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Já existe um evento com este slug');
      }
    }

    return await this.prisma.event.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        location: dto.location,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async deactivate(id: string): Promise<Event> {
    await this.ensureExists(id);

    return await this.prisma.event.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async ensureExists(id: string): Promise<Event> {
    const event: Event | null = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }
}
