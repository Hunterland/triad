// src/brackets/brackets.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BattlePhase,
  BattleStatus,
  BracketType,
  RegistrationStatus,
  RoundStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BracketViewResponseDto } from './dto/bracket-view-response.dto';
import { CreateBracketDto } from './dto/create-bracket.dto';
import { RoundResponseDto } from './dto/round-response.dto';

@Injectable()
export class BracketsService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(dto: CreateBracketDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (!event.isActive) {
      throw new BadRequestException(
        'Não é possível gerar chave para evento inativo.',
      );
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (!category.isActive) {
      throw new BadRequestException(
        'Não é possível gerar chave para categoria inativa.',
      );
    }

    if (category.eventId !== dto.eventId) {
      throw new BadRequestException(
        'A categoria informada não pertence ao evento informado.',
      );
    }

    const existingBracket = await this.prisma.bracket.findFirst({
      where: {
        eventId: dto.eventId,
        categoryId: dto.categoryId,
        type: dto.type,
        isActive: true,
      },
    });

    if (existingBracket) {
      throw new ConflictException(
        'Já existe uma chave ativa para este evento, categoria e tipo.',
      );
    }

    const approvedRegistrations = await this.prisma.eventParticipant.findMany({
      where: {
        eventId: dto.eventId,
        categoryId: dto.categoryId,
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
      include: {
        athlete: true,
        crew: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const size = dto.type === BracketType.TOP8 ? 8 : 16;

    if (approvedRegistrations.length < size) {
      throw new BadRequestException(
        `Quantidade insuficiente de inscrições aprovadas para gerar chave ${dto.type}. Necessário: ${size}. Encontrado: ${approvedRegistrations.length}.`,
      );
    }

    if (approvedRegistrations.length > size) {
      throw new BadRequestException(
        `Há mais inscrições aprovadas do que o limite da chave ${dto.type}. Implemente filtro/pré-seleção antes de gerar a chave.`,
      );
    }

    const bracketName = `${event.name} - ${category.name} - ${dto.type}`;

    const firstPhase =
      dto.type === BracketType.TOP8
        ? BattlePhase.QUARTER_FINAL
        : BattlePhase.ROUND_OF_16;

    const numberOfBattles = size / 2;

    return this.prisma.$transaction(async (tx) => {
      const bracket = await tx.bracket.create({
        data: {
          eventId: dto.eventId,
          categoryId: dto.categoryId,
          type: dto.type,
          name: bracketName,
          isActive: true,
        },
      });

      const battlesData = Array.from(
        { length: numberOfBattles },
        (_, index) => ({
          bracketId: bracket.id,
          phase: firstPhase,
          order: index + 1,
          status: BattleStatus.PENDING,
          isActive: true,
        }),
      );

      await tx.battle.createMany({
        data: battlesData,
      });

      const battles = await tx.battle.findMany({
        where: { bracketId: bracket.id },
        orderBy: [{ phase: 'asc' }, { order: 'asc' }],
      });

      return {
        bracket,
        battles,
        registrationsUsed: approvedRegistrations.map((registration) => ({
          id: registration.id,
          athleteId: registration.athleteId,
          athleteName: registration.athlete.name,
          crewId: registration.crewId,
          status: registration.status,
        })),
      };
    });
  }

  async findByEventAndCategory(
    eventId: string,
    categoryId: string,
  ): Promise<BracketViewResponseDto> {
    const bracket = await this.prisma.bracket.findFirst({
      where: {
        eventId,
        categoryId,
        isActive: true,
      },
      include: {
        battles: {
          orderBy: [{ phase: 'asc' }, { order: 'asc' }],
        },
        event: true,
        category: true,
      },
    });

    if (!bracket) {
      throw new NotFoundException(
        'Nenhuma chave ativa encontrada para este evento e categoria.',
      );
    }

    return {
      bracket: {
        id: bracket.id,
        eventId: bracket.eventId,
        categoryId: bracket.categoryId,
        type: bracket.type,
        name: bracket.name,
        isActive: bracket.isActive,
        createdAt: bracket.createdAt,
        updatedAt: bracket.updatedAt,
      },
      event: {
        id: bracket.event.id,
        name: bracket.event.name,
        slug: bracket.event.slug,
        description: bracket.event.description,
        location: bracket.event.location,
        startDate: bracket.event.startDate,
        endDate: bracket.event.endDate,
        isActive: bracket.event.isActive,
      },
      category: {
        id: bracket.category.id,
        eventId: bracket.category.eventId,
        name: bracket.category.name,
        slug: bracket.category.slug,
        description: bracket.category.description,
        rules: bracket.category.rules,
        minAge: bracket.category.minAge,
        maxAge: bracket.category.maxAge,
        level: bracket.category.level,
        isTeam: bracket.category.isTeam,
        isActive: bracket.category.isActive,
      },
      battles: bracket.battles.map((battle) => ({
        id: battle.id,
        bracketId: battle.bracketId,
        phase: battle.phase,
        order: battle.order,
        status: battle.status,
        isActive: battle.isActive,
        createdAt: battle.createdAt,
        updatedAt: battle.updatedAt,
      })),
    };
  }

  async updateBattleStatus(battleId: string, newStatus: BattleStatus) {
    const battle = await this.prisma.battle.findFirst({
      where: {
        id: battleId,
        isActive: true,
      },
    });

    if (!battle) {
      throw new NotFoundException('Batalha não encontrada ou inativa.');
    }

    const allowedTransitions: Record<BattleStatus, BattleStatus[]> = {
      [BattleStatus.PENDING]: [BattleStatus.ONGOING],
      [BattleStatus.ONGOING]: [BattleStatus.FINISHED],
      [BattleStatus.FINISHED]: [],
    };

    const allowedNextStatuses = allowedTransitions[battle.status];

    if (!allowedNextStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Transição de status não permitida: ${battle.status} → ${newStatus}.`,
      );
    }

    return this.prisma.battle.update({
      where: { id: battle.id },
      data: { status: newStatus },
    });
  }

  async createRounds(
    battleId: string,
    quantity: number,
  ): Promise<RoundResponseDto[]> {
    const battle = await this.prisma.battle.findFirst({
      where: {
        id: battleId,
        isActive: true,
      },
    });

    if (!battle) {
      throw new NotFoundException('Batalha não encontrada ou inativa.');
    }

    if (battle.status !== BattleStatus.PENDING) {
      throw new BadRequestException(
        'Só é possível criar rounds para uma batalha com status PENDING.',
      );
    }

    const existingRounds = await this.prisma.round.count({
      where: {
        battleId,
        isActive: true,
      },
    });

    if (existingRounds > 0) {
      throw new ConflictException('A batalha já possui rounds ativos.');
    }

    const roundsData = Array.from({ length: quantity }, (_, index) => ({
      battleId,
      order: index + 1,
      status: RoundStatus.PENDING,
      isActive: true,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.round.createMany({
        data: roundsData,
      });

      const rounds = await tx.round.findMany({
        where: {
          battleId,
          isActive: true,
        },
        orderBy: {
          order: 'asc',
        },
      });

      return rounds.map((round) => ({
        id: round.id,
        battleId: round.battleId,
        order: round.order,
        status: round.status,
        isActive: round.isActive,
        createdAt: round.createdAt,
        updatedAt: round.updatedAt,
      }));
    });
  }

  async findRoundsByBattle(battleId: string): Promise<RoundResponseDto[]> {
    const battle = await this.prisma.battle.findFirst({
      where: {
        id: battleId,
        isActive: true,
      },
    });

    if (!battle) {
      throw new NotFoundException('Batalha não encontrada ou inativa.');
    }

    const rounds = await this.prisma.round.findMany({
      where: {
        battleId,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return rounds.map((round) => ({
      id: round.id,
      battleId: round.battleId,
      order: round.order,
      status: round.status,
      isActive: round.isActive,
      createdAt: round.createdAt,
      updatedAt: round.updatedAt,
    }));
  }
}
