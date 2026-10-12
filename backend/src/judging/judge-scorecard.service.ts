import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJudgeCriterionScoreDto } from './dto/create-judge-criterion-score.dto';
import { CreateJudgeScorecardDto } from './dto/create-judge-scorecard.dto';
import { UpdateJudgeCriterionScoreDto } from './dto/update-judge-criterion-score.dto';

@Injectable()
export class JudgeScorecardService {
  constructor(private readonly prisma: PrismaService) {}

  async createForRound(
    roundId: string,
    userId: string,
    dto: CreateJudgeScorecardDto,
  ) {
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

    if (round.status !== 'ONGOING') {
      throw new ConflictException(
        'Só é possível criar scorecard para um round em andamento.',
      );
    }

    if (battle.competitors.length !== 2) {
      throw new BadRequestException(
        'A batalha deve possuir exatamente dois competidores ativos.',
      );
    }

    const assignment = await this.findJudgeAssignmentForCategory(
      userId,
      eventId,
      categoryId,
    );

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
          judgeAssignmentId: assignment.id,
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
            judgeAssignmentId: assignment.id,
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
          include: this.scorecardDetailsInclude(),
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

  async findByRound(roundId: string, userId: string) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: {
        battle: {
          include: {
            bracket: true,
          },
        },
      },
    });

    if (!round || !round.isActive) {
      throw new NotFoundException('Round não encontrado ou inativo.');
    }

    const assignment = await this.findJudgeAssignmentForCategory(
      userId,
      round.battle.bracket.eventId,
      round.battle.bracket.categoryId,
    );

    return this.prisma.judgeScorecard.findMany({
      where: {
        roundId,
        judgeAssignmentId: assignment.id,
        isActive: true,
      },
      include: this.scorecardDetailsInclude(),
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(scorecardId: string, userId: string) {
    const scorecard = await this.prisma.judgeScorecard.findFirst({
      where: {
        id: scorecardId,
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
        round: {
          include: {
            battle: {
              include: {
                bracket: true,
              },
            },
          },
        },
      },
    });

    if (!scorecard) {
      throw new NotFoundException('Scorecard não encontrado ou inativo.');
    }

    await this.assertScorecardOwnership(scorecard.id, userId);

    return this.prisma.judgeScorecard.findUniqueOrThrow({
      where: { id: scorecard.id },
      include: this.scorecardDetailsInclude(),
    });
  }

  async updateCriterionScore(
    scorecardId: string,
    criterionScoreId: string,
    userId: string,
    dto: UpdateJudgeCriterionScoreDto,
  ) {
    const scorecard = await this.prisma.judgeScorecard.findFirst({
      where: {
        id: scorecardId,
        isActive: true,
      },
      include: {
        judgingConfiguration: {
          include: {
            criteria: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!scorecard) {
      throw new NotFoundException('Scorecard não encontrado ou inativo.');
    }

    await this.assertScorecardOwnership(scorecard.id, userId);

    if (scorecard.status !== 'DRAFT') {
      throw new ConflictException(
        'Não é possível alterar notas de um scorecard submetido.',
      );
    }

    const criterionScore = await this.prisma.judgeCriterionScore.findFirst({
      where: {
        id: criterionScoreId,
        judgeScorecardId: scorecard.id,
      },
      include: {
        judgeCriterion: true,
        battleCompetitor: true,
      },
    });

    if (!criterionScore) {
      throw new NotFoundException(
        'Nota não encontrada para o scorecard informado.',
      );
    }

    if (
      criterionScore.judgeCriterion.judgingConfigurationId !==
      scorecard.judgingConfigurationId
    ) {
      throw new BadRequestException(
        'O critério da nota não pertence à configuração do scorecard.',
      );
    }

    const min = Number(criterionScore.judgeCriterion.minScore);
    const max = Number(criterionScore.judgeCriterion.maxScore);

    if (dto.score < min || dto.score > max) {
      throw new BadRequestException(
        `A nota do critério ${criterionScore.judgeCriterion.code} deve estar entre ${min} e ${max}.`,
      );
    }

    return this.prisma.judgeCriterionScore.update({
      where: {
        id: criterionScore.id,
      },
      data: {
        score: new Prisma.Decimal(dto.score),
      },
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
        judgeScorecard: {
          select: {
            id: true,
            status: true,
            roundId: true,
          },
        },
      },
    });
  }

  async submit(scorecardId: string, userId: string) {
    const scorecard = await this.prisma.judgeScorecard.findFirst({
      where: {
        id: scorecardId,
        isActive: true,
      },
      include: {
        round: {
          include: {
            battle: {
              include: {
                competitors: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
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
            judgeCriterion: true,
            battleCompetitor: true,
          },
        },
      },
    });

    if (!scorecard) {
      throw new NotFoundException('Scorecard não encontrado ou inativo.');
    }

    await this.assertScorecardOwnership(scorecard.id, userId);

    if (scorecard.status !== 'DRAFT') {
      throw new ConflictException('O scorecard já foi submetido.');
    }

    if (scorecard.round.status !== 'ONGOING') {
      throw new ConflictException(
        'Só é possível submeter scorecard de um round em andamento.',
      );
    }

    if (scorecard.round.battle.status !== 'ONGOING') {
      throw new ConflictException(
        'Só é possível submeter scorecard de uma batalha em andamento.',
      );
    }

    const competitorIds = scorecard.round.battle.competitors.map(
      (competitor) => competitor.id,
    );

    const criteria = scorecard.judgingConfiguration.criteria;

    if (competitorIds.length !== 2) {
      throw new BadRequestException(
        'A batalha deve possuir exatamente dois competidores ativos.',
      );
    }

    if (criteria.length === 0) {
      throw new BadRequestException(
        'A configuração de julgamento não possui critérios ativos.',
      );
    }

    const expectedCount = competitorIds.length * criteria.length;

    if (scorecard.criterionScores.length !== expectedCount) {
      throw new BadRequestException(
        `O scorecard está incompleto. Esperado: ${expectedCount} notas. Encontrado: ${scorecard.criterionScores.length}.`,
      );
    }

    const validCompetitorIds = new Set(competitorIds);
    const validCriteriaById = new Map(
      criteria.map((criterion) => [criterion.id, criterion]),
    );
    const combinations = new Set<string>();

    for (const criterionScore of scorecard.criterionScores) {
      if (!validCompetitorIds.has(criterionScore.battleCompetitorId)) {
        throw new BadRequestException(
          'O scorecard possui nota para competidor que não pertence à batalha.',
        );
      }

      const criterion = validCriteriaById.get(criterionScore.judgeCriterionId);

      if (!criterion) {
        throw new BadRequestException(
          'O scorecard possui nota para critério que não pertence à configuração ativa.',
        );
      }

      const combinationKey = `${criterionScore.battleCompetitorId}:${criterionScore.judgeCriterionId}`;

      if (combinations.has(combinationKey)) {
        throw new BadRequestException(
          'O scorecard possui notas duplicadas para o mesmo competidor e critério.',
        );
      }

      combinations.add(combinationKey);

      const score = Number(criterionScore.score);
      const min = Number(criterion.minScore);
      const max = Number(criterion.maxScore);

      if (score < min || score > max) {
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
            'Todo competidor deve possuir uma nota para cada critério ativo.',
          );
        }
      }
    }

    return this.prisma.judgeScorecard.update({
      where: {
        id: scorecard.id,
      },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      include: this.scorecardDetailsInclude(),
    });
  }

  private async findJudgeAssignmentForCategory(
    userId: string,
    eventId: string,
    categoryId: string,
  ) {
    const assignment = await this.prisma.judgeAssignment.findFirst({
      where: {
        categoryId,
        isActive: true,
        eventStaff: {
          eventId,
          role: 'JUDGE',
          isActive: true,
          staffMember: {
            userId,
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
        'O usuário autenticado não possui uma atribuição ativa de juiz para esta categoria.',
      );
    }

    return assignment;
  }

  private async assertScorecardOwnership(scorecardId: string, userId: string) {
    const ownedScorecard = await this.prisma.judgeScorecard.findFirst({
      where: {
        id: scorecardId,
        isActive: true,
        judgeAssignment: {
          isActive: true,
          eventStaff: {
            role: 'JUDGE',
            isActive: true,
            staffMember: {
              userId,
              isActive: true,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!ownedScorecard) {
      throw new ForbiddenException(
        'Você não possui permissão para acessar este scorecard.',
      );
    }
  }

  private scorecardDetailsInclude() {
    return {
      judgeAssignment: {
        include: {
          eventStaff: {
            include: {
              staffMember: true,
            },
          },
        },
      },
      round: {
        include: {
          battle: {
            include: {
              bracket: {
                include: {
                  event: true,
                  category: true,
                },
              },
              competitors: {
                where: { isActive: true },
                orderBy: { side: 'asc' as const },
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
        },
      },
      judgingConfiguration: {
        include: {
          criteria: {
            where: { isActive: true },
            orderBy: { order: 'asc' as const },
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
              side: 'asc' as const,
            },
          },
          {
            judgeCriterion: {
              order: 'asc' as const,
            },
          },
        ],
      },
    } satisfies Prisma.JudgeScorecardInclude;
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
