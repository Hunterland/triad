import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BattlePhase,
  BattleSide,
  BattleStatus,
  BracketType,
  Prisma,
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
      where: {
        id: dto.eventId,
      },
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
      where: {
        id: dto.categoryId,
      },
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
      },
    });

    if (existingBracket) {
      throw new ConflictException(
        'Já existe uma chave para este evento, categoria e tipo.',
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

    try {
      return await this.prisma.$transaction(async (tx) => {
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
          where: {
            bracketId: bracket.id,
          },
          orderBy: {
            order: 'asc',
          },
        });

        const battleCompetitorsData = battles.flatMap((battle, battleIndex) => {
          const redRegistration = approvedRegistrations[battleIndex * 2];
          const blueRegistration = approvedRegistrations[battleIndex * 2 + 1];

          if (!redRegistration || !blueRegistration) {
            throw new BadRequestException(
              'Não foi possível distribuir todas as inscrições aprovadas entre as batalhas.',
            );
          }

          return [
            {
              battleId: battle.id,
              eventParticipantId: redRegistration.id,
              side: BattleSide.RED,
              isActive: true,
            },
            {
              battleId: battle.id,
              eventParticipantId: blueRegistration.id,
              side: BattleSide.BLUE,
              isActive: true,
            },
          ];
        });

        await tx.battleCompetitor.createMany({
          data: battleCompetitorsData,
        });

        const battlesWithCompetitors = await tx.battle.findMany({
          where: {
            bracketId: bracket.id,
            isActive: true,
          },
          orderBy: [
            {
              phase: 'asc',
            },
            {
              order: 'asc',
            },
          ],
          include: {
            competitors: {
              where: {
                isActive: true,
              },
              orderBy: {
                side: 'asc',
              },
              include: {
                eventParticipant: {
                  include: {
                    athlete: true,
                    crew: true,
                  },
                },
              },
            },
          },
        });

        return {
          bracket,
          battles: battlesWithCompetitors.map((battle) =>
            this.mapBattleToResponse(battle),
          ),
          registrationsUsed: approvedRegistrations.map((registration) => ({
            id: registration.id,
            athleteId: registration.athleteId,
            athleteName: registration.athlete.name,
            athleteStageName: registration.athlete.stageName,
            crewId: registration.crewId,
            crewName: registration.crew?.name ?? null,
            status: registration.status,
          })),
        };
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe uma chave para este evento, categoria e tipo.',
        );
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Não foi possível associar os competidores à chave.',
        );
      }

      throw error;
    }
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
          where: {
            isActive: true,
          },
          orderBy: [
            {
              phase: 'asc',
            },
            {
              order: 'asc',
            },
          ],
          include: {
            competitors: {
              where: {
                isActive: true,
              },
              orderBy: {
                side: 'asc',
              },
              include: {
                eventParticipant: {
                  include: {
                    athlete: true,
                    crew: true,
                  },
                },
              },
            },
          },
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
      battles: bracket.battles.map((battle) =>
        this.mapBattleToResponse(battle),
      ),
    };
  }

  async updateBattleStatus(battleId: string, newStatus: BattleStatus) {
    const battle = await this.prisma.battle.findFirst({
      where: {
        id: battleId,
        isActive: true,
      },
      include: {
        competitors: {
          where: {
            isActive: true,
          },
        },
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

    if (newStatus === BattleStatus.ONGOING && battle.competitors.length !== 2) {
      throw new BadRequestException(
        'A batalha precisa possuir exatamente dois competidores ativos antes de iniciar.',
      );
    }

    if (newStatus === BattleStatus.FINISHED) {
      const unfinishedRound = await this.prisma.round.findFirst({
        where: {
          battleId: battle.id,
          isActive: true,
          status: {
            not: RoundStatus.FINISHED,
          },
        },
      });

      if (unfinishedRound) {
        throw new BadRequestException(
          'Não é possível finalizar a batalha enquanto existirem rounds não finalizados.',
        );
      }
    }

    return this.prisma.battle.update({
      where: {
        id: battle.id,
      },
      data: {
        status: newStatus,
      },
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

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException(
        'A quantidade de rounds deve ser um inteiro maior que zero.',
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

      return rounds.map((round) => this.mapRoundToResponse(round));
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

    return rounds.map((round) => this.mapRoundToResponse(round));
  }

  async updateRoundStatus(
    roundId: string,
    newStatus: RoundStatus,
  ): Promise<RoundResponseDto> {
    const round = await this.prisma.round.findFirst({
      where: {
        id: roundId,
        isActive: true,
      },
      include: {
        battle: true,
      },
    });

    if (!round) {
      throw new NotFoundException('Round não encontrado ou inativo.');
    }

    const allowedTransitions: Record<RoundStatus, RoundStatus[]> = {
      [RoundStatus.PENDING]: [RoundStatus.ONGOING],
      [RoundStatus.ONGOING]: [RoundStatus.FINISHED],
      [RoundStatus.FINISHED]: [],
    };

    const allowedNextStatuses = allowedTransitions[round.status];

    if (!allowedNextStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Transição de status não permitida: ${round.status} → ${newStatus}.`,
      );
    }

    if (
      newStatus === RoundStatus.ONGOING &&
      round.battle.status !== BattleStatus.ONGOING
    ) {
      throw new BadRequestException(
        'Não é possível iniciar um round quando a batalha não está em andamento.',
      );
    }

    if (newStatus === RoundStatus.ONGOING && round.order > 1) {
      const previousRound = await this.prisma.round.findFirst({
        where: {
          battleId: round.battleId,
          order: round.order - 1,
          isActive: true,
        },
      });

      if (!previousRound || previousRound.status !== RoundStatus.FINISHED) {
        throw new BadRequestException(
          'O round anterior deve estar finalizado antes de iniciar este round.',
        );
      }
    }

    const updatedRound = await this.prisma.round.update({
      where: {
        id: round.id,
      },
      data: {
        status: newStatus,
      },
    });

    return this.mapRoundToResponse(updatedRound);
  }

  private mapRoundToResponse(round: {
    id: string;
    battleId: string;
    order: number;
    status: RoundStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): RoundResponseDto {
    return {
      id: round.id,
      battleId: round.battleId,
      order: round.order,
      status: round.status,
      isActive: round.isActive,
      createdAt: round.createdAt,
      updatedAt: round.updatedAt,
    };
  }

  private mapBattleToResponse<
    T extends {
      id: string;
      bracketId: string;
      phase: BattlePhase;
      order: number;
      status: BattleStatus;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      competitors: Array<{
        id: string;
        eventParticipantId: string;
        side: BattleSide;
        isActive: boolean;
        eventParticipant: {
          athleteId: string;
          crewId: string | null;
          athlete: {
            name: string;
            stageName: string | null;
          };
          crew: {
            name: string;
          } | null;
        };
      }>;
    },
  >(battle: T) {
    return {
      id: battle.id,
      bracketId: battle.bracketId,
      phase: battle.phase,
      order: battle.order,
      status: battle.status,
      isActive: battle.isActive,
      competitors: battle.competitors.map((competitor) => ({
        id: competitor.id,
        eventParticipantId: competitor.eventParticipantId,
        side: competitor.side,
        athleteId: competitor.eventParticipant.athleteId,
        athleteName: competitor.eventParticipant.athlete.name,
        athleteStageName: competitor.eventParticipant.athlete.stageName,
        crewId: competitor.eventParticipant.crewId,
        crewName: competitor.eventParticipant.crew?.name ?? null,
        isActive: competitor.isActive,
      })),
      createdAt: battle.createdAt,
      updatedAt: battle.updatedAt,
    };
  }
}
