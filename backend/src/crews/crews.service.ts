// src/crews/crews.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Crew } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddCrewMemberDto } from './dto/add-crew-member.dto';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';

@Injectable()
export class CrewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCrewDto): Promise<Crew> {
    return this.prisma.crew.create({
      data: {
        name: dto.name,
        city: dto.city,
        country: dto.country,
      },
    });
  }

  async findAll() {
    return this.prisma.crew.findMany({
      include: {
        members: {
          include: {
            athlete: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const crew = await this.prisma.crew.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            athlete: true,
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    });

    if (!crew) {
      throw new NotFoundException('Crew não encontrada');
    }

    return crew;
  }

  async update(id: string, dto: UpdateCrewDto) {
    await this.findOne(id);

    return this.prisma.crew.update({
      where: { id },
      data: {
        name: dto.name,
        city: dto.city,
        country: dto.country,
        isActive: dto.isActive,
      },
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.crew.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async addMember(crewId: string, dto: AddCrewMemberDto) {
    await this.findOne(crewId);

    const athlete = await this.prisma.athlete.findUnique({
      where: { id: dto.athleteId },
    });

    if (!athlete) {
      throw new NotFoundException('Atleta não encontrado');
    }

    const existing = await this.prisma.crewMember.findUnique({
      where: {
        crewId_athleteId: {
          crewId,
          athleteId: dto.athleteId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Atleta já pertence a esta crew');
    }

    return this.prisma.crewMember.create({
      data: {
        crewId,
        athleteId: dto.athleteId,
        role: dto.role,
      },
      include: {
        crew: true,
        athlete: true,
      },
    });
  }

  async removeMember(crewId: string, athleteId: string) {
    const existing = await this.prisma.crewMember.findUnique({
      where: {
        crewId_athleteId: {
          crewId,
          athleteId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Membro não encontrado na crew');
    }

    await this.prisma.crewMember.delete({
      where: {
        crewId_athleteId: {
          crewId,
          athleteId,
        },
      },
    });

    return {
      message: 'Membro removido com sucesso',
    };
  }
}
