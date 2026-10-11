import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJudgeScorecardDto } from './dto/create-judge-scorecard.dto';
import { CreateJudgeCriterionScoreDto } from './dto/create-judge-criterion-score.dto';

@Injectable()
export class JudgeScorecardService {
  constructor(private readonly prisma: PrismaService) {}

  async createForRound(roundId: string, dto: CreateJudgeScorecardDto) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: {
        battle: {
          include: {
            bracket: {
              include: {
                category: true,
              },
            },
            competitors: {
              where: { isActive: true },
              orderBy: { side: 'asc' },
            },
          },
        },
      },
    });

    if (!round || !round.isActive) {
      throw new NotFoundException('Round não encontrado ou inativo.');
    }

    const battle = round.battle;
    const categoryId = battle.bracket.categoryId;
    const eventId = battle.bracket.eventId;

    if (battle.status !== 'ONGOING') {
      throw new ConflictException(
        'Só é possível criar scorecard para uma batalha em andamento.',
      );
    }

    if (round.status === 'FINISHED') {
      throw new ConflictException(
        'Não é possível criar scorecard para um round finalizado.',
      );
    }

    if (battle.competitors.length !== 2) {
      throw new BadRequestException(
        'A batalha deve possuir exatamente dois competidores ativos.',
      );
    }

    const assignment = await this.prisma.judgeAssignment.findFirst({
      where: {
        id: dto.judgeAssignmentId,
        categoryId,
        isActive: true,
        eventStaff: {
          eventId,
          role: 'JUDGE',
          isActive: true,
          staffMember: {
            isActive: true,
          },
        },
      },
      include: {
        eventStaff: {
          include: {
            staffMember: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'A atribuição informada não corresponde a um juiz ativo desta categoria e evento.',
      );
    }

    const configuration = await this.prisma.judgingConfiguration.findFirst({
      where: {
        id: dto.judgingConfigurationId,
        categoryId,
        purpose: 'BATTLE',
        interfaceType: 'TRIAD',
        status: 'PUBLISHED',
        isActive: true,
      },
      include: {
        criteria: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!configuration) {
      throw new NotFoundException(
        'Configuração TRIAD publicada não encontrada para esta categoria.',
      );
    }

    if (configuration.criteria.length === 0) {
      throw new BadRequestException(
        'A configuração publicada não possui critérios ativos.',
      );
    }

    const duplicate = await this.prisma.judgeScorecard.findUnique({
      where: {
        judgeAssignmentId_roundId: {
          judgeAssignmentId: dto.judgeAssignmentId,
          roundId,
        },
      },
    });

    if (duplicate) {
      throw new ConflictException(
        'Já existe um scorecard para este juiz neste round.',
      );
    }

    this.validateCriterionScores(
      battle.competitors.map((competitor) => competitor.id),
      configuration.criteria,
      dto.criterionScores,
    );

    try {
      return await this.prisma.$transaction(async (tx) => {
        const scorecard = await tx.judgeScorecard.create({
          data: {
            judgeAssignmentId: dto.judgeAssignmentId,
            roundId,
            judgingConfigurationId: configuration.id,
            status: 'DRAFT',
          },
        });

        await tx.judgeCriterionScore.createMany({
          data: dto.criterionScores.map((item) => ({
            judgeScorecardId: scorecard.id,
            battleCompetitorId: item.battleCompetitorId,
            judgeCriterionId: item.judgeCriterionId,
            score: new Prisma.Decimal(item.score),
          })),
        });

        return tx.judgeScorecard.findUniqueOrThrow({
          where: { id: scorecard.id },
          include: {
            judgeAssignment: {
              include: {
                eventStaff: {
                  include: {
                    staffMember: true,
                  },
                },
              },
            },
            round: true,
            judgingConfiguration: {
              include: {
                criteria: {
                  where: { isActive: true },
                  orderBy: { order: 'asc' },
                },
              },
            },
            criterionScores: {
              include: {
                battleCompetitor: {
                  include: {
                    eventParticipant: {
                      include: {
                        athlete: true,
                        crew: true,
                      },
                    },
                  },
                },
                judgeCriterion: true,
              },
              orderBy: [
                {
                  battleCompetitor: {
                    side: 'asc',
                  },
                },
                {
                  judgeCriterion: {
                    order: 'asc',
                  },
                },
              ],
            },
          },
        });
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um scorecard ou uma nota duplicada para este juiz e round.',
        );
      }

      throw error;
    }
  }

  async findByRound(roundId: string) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      select: { id: true },
    });

    if (!round) {
      throw new NotFoundException('Round não encontrado.');
    }

    return this.prisma.judgeScorecard.findMany({
      where: {
        roundId,
        isActive: true,
      },
      include: {
        judgeAssignment: {
          include: {
            eventStaff: {
              include: {
                staffMember: true,
              },
            },
          },
        },
        judgingConfiguration: {
          select: {
            id: true,
            name: true,
            interfaceType: true,
            purpose: true,
            version: true,
          },
        },
        criterionScores: {
          include: {
            battleCompetitor: {
              include: {
                eventParticipant: {
                  include: {
                    athlete: true,
                    crew: true,
                  },
                },
              },
            },
            judgeCriterion: true,
          },
          orderBy: [
            {
              battleCompetitor: {
                side: 'asc',
              },
            },
            {
              judgeCriterion: {
                order: 'asc',
              },
            },
          ],
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  private validateCriterionScores(
    competitorIds: string[],
    criteria: Array<{
      id: string;
      code: string;
      minScore: Prisma.Decimal;
      maxScore: Prisma.Decimal;
    }>,
    scores: CreateJudgeCriterionScoreDto[],
  ) {
    const expectedCount = competitorIds.length * criteria.length;

    if (scores.length !== expectedCount) {
      throw new BadRequestException(
        `O scorecard deve conter exatamente ${expectedCount} notas: ` +
          `${competitorIds.length} competidores × ${criteria.length} critérios.`,
      );
    }

    const validCompetitorIds = new Set(competitorIds);
    const criteriaById = new Map(
      criteria.map((criterion) => [criterion.id, criterion]),
    );
    const combinations = new Set<string>();

    for (const item of scores) {
      if (!validCompetitorIds.has(item.battleCompetitorId)) {
        throw new BadRequestException(
          `O competidor ${item.battleCompetitorId} não pertence a esta batalha.`,
        );
      }

      const criterion = criteriaById.get(item.judgeCriterionId);

      if (!criterion) {
        throw new BadRequestException(
          `O critério ${item.judgeCriterionId} não pertence à configuração publicada.`,
        );
      }

      const combinationKey = `${item.battleCompetitorId}:${item.judgeCriterionId}`;

      if (combinations.has(combinationKey)) {
        throw new BadRequestException(
          'Cada competidor pode receber apenas uma nota por critério.',
        );
      }

      combinations.add(combinationKey);

      const min = Number(criterion.minScore);
      const max = Number(criterion.maxScore);

      if (item.score < min || item.score > max) {
        throw new BadRequestException(
          `A nota do critério ${criterion.code} deve estar entre ${min} e ${max}.`,
        );
      }
    }

    for (const competitorId of competitorIds) {
      for (const criterion of criteria) {
        const combinationKey = `${competitorId}:${criterion.id}`;

        if (!combinations.has(combinationKey)) {
          throw new BadRequestException(
            'Todo competidor deve receber uma nota para cada critério ativo.',
          );
        }
      }
    }
  }
}
