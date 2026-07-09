// src/athletes/athletes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Athlete } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

@Injectable()
export class AthletesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAthleteDto): Promise<Athlete> {
    return this.prisma.athlete.create({
      data: {
        name: dto.name,
        stageName: dto.stageName,
        email: dto.email,
        phone: dto.phone,
        country: dto.country,
        city: dto.city,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        userId: dto.userId,
      },
    });
  }

  async findAll(): Promise<Athlete[]> {
    return this.prisma.athlete.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Athlete> {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
    });

    if (!athlete) {
      throw new NotFoundException('Atleta não encontrado');
    }

    return athlete;
  }

  async update(id: string, dto: UpdateAthleteDto): Promise<Athlete> {
    await this.findOne(id);

    return this.prisma.athlete.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
    });
  }

  async deactivate(id: string): Promise<Athlete> {
    await this.findOne(id);

    return this.prisma.athlete.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
