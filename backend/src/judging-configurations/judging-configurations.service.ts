import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  JudgingConfigurationStatus,
  JudgingPurpose,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJudgeCriterionDto } from './dto/create-judge-criterion.dto';
import { CreateJudgingConfigurationDto } from './dto/create-judging-configuration.dto';
import { CreateJudgingConfigurationVersionDto } from './dto/create-judging-configuration-version.dto';
import { JudgeCriterionResponseDto } from './dto/judge-criterion-response.dto';
import { JudgingConfigurationResponseDto } from './dto/judging-configuration-response.dto';
import { ReorderJudgeCriteriaDto } from './dto/reorder-judge-criteria.dto';
import { UpdateJudgeCriterionDto } from './dto/update-judge-criterion.dto';

@Injectable()
export class JudgingConfigurationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    categoryId: string,
    dto: CreateJudgingConfigurationDto,
  ): Promise<JudgingConfigurationResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada ou inativa.');
    }

    const purpose = dto.purpose ?? JudgingPurpose.BATTLE;

    const latestConfiguration =
      await this.prisma.judgingConfiguration.findFirst({
        where: {
          categoryId,
          purpose,
        },
        orderBy: {
          version: 'desc',
        },
      });

    const nextVersion = latestConfiguration
      ? latestConfiguration.version + 1
      : 1;

    try {
      const configuration = await this.prisma.judgingConfiguration.create({
        data: {
          categoryId,
          name: dto.name.trim(),
          interfaceType: dto.interfaceType,
          purpose,
          status: JudgingConfigurationStatus.DRAFT,
          version: nextVersion,
          isActive: true,
        },
      });

      return this.mapToResponse(configuration);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe uma configuração com esta versão para a categoria e finalidade.',
        );
      }

      throw error;
    }
  }

  async findByCategory(
    categoryId: string,
  ): Promise<JudgingConfigurationResponseDto[]> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada ou inativa.');
    }

    const configurations = await this.prisma.judgingConfiguration.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      orderBy: [
        {
          purpose: 'asc',
        },
        {
          version: 'desc',
        },
      ],
    });

    return configurations.map((configuration) =>
      this.mapToResponse(configuration),
    );
  }

  async createCriterion(
    configurationId: string,
    dto: CreateJudgeCriterionDto,
  ): Promise<JudgeCriterionResponseDto> {
    const configuration = await this.prisma.judgingConfiguration.findFirst({
      where: {
        id: configurationId,
        isActive: true,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!configuration) {
      throw new NotFoundException(
        'Configuração de julgamento não encontrada ou inativa.',
      );
    }

    if (configuration.status !== JudgingConfigurationStatus.DRAFT) {
      throw new BadRequestException(
        'Critérios só podem ser incluídos em configurações com status DRAFT.',
      );
    }

    const minScore = dto.minScore ?? 0;
    const maxScore = dto.maxScore ?? 10;

    if (maxScore <= minScore) {
      throw new BadRequestException('maxScore deve ser maior que minScore.');
    }

    const normalizedCode = dto.code.trim().toUpperCase();

    const [criterionWithSameCode, criterionWithSameOrder] = await Promise.all([
      this.prisma.judgeCriterion.findFirst({
        where: {
          judgingConfigurationId: configurationId,
          code: normalizedCode,
          isActive: true,
        },
      }),
      this.prisma.judgeCriterion.findFirst({
        where: {
          judgingConfigurationId: configurationId,
          order: dto.order,
          isActive: true,
        },
      }),
    ]);

    if (criterionWithSameCode) {
      throw new ConflictException(
        'Já existe um critério ativo com este código na configuração.',
      );
    }

    if (criterionWithSameOrder) {
      throw new ConflictException(
        'Já existe um critério ativo com esta ordem na configuração.',
      );
    }

    try {
      const criterion = await this.prisma.judgeCriterion.create({
        data: {
          judgingConfigurationId: configurationId,
          code: normalizedCode,
          name: dto.name.trim(),
          description: dto.description?.trim() || null,
          weight: new Prisma.Decimal(dto.weight),
          order: dto.order,
          minScore: new Prisma.Decimal(minScore),
          maxScore: new Prisma.Decimal(maxScore),
          isActive: true,
        },
      });

      return this.mapCriterionToResponse(criterion);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um critério com o mesmo código ou ordem nesta configuração.',
        );
      }

      throw error;
    }
  }

  async findCriteriaByConfiguration(
    configurationId: string,
  ): Promise<JudgeCriterionResponseDto[]> {
    const configuration = await this.prisma.judgingConfiguration.findFirst({
      where: {
        id: configurationId,
        isActive: true,
      },
    });

    if (!configuration) {
      throw new NotFoundException(
        'Configuração de julgamento não encontrada ou inativa.',
      );
    }

    const criteria = await this.prisma.judgeCriterion.findMany({
      where: {
        judgingConfigurationId: configurationId,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return criteria.map((criterion) => this.mapCriterionToResponse(criterion));
  }

  async publish(
    configurationId: string,
  ): Promise<JudgingConfigurationResponseDto> {
    const configuration = await this.prisma.judgingConfiguration.findFirst({
      where: {
        id: configurationId,
        isActive: true,
      },
      include: {
        criteria: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!configuration) {
      throw new NotFoundException(
        'Configuração de julgamento não encontrada ou inativa.',
      );
    }

    if (configuration.status !== JudgingConfigurationStatus.DRAFT) {
      throw new BadRequestException(
        'Somente configurações com status DRAFT podem ser publicadas.',
      );
    }

    if (configuration.criteria.length === 0) {
      throw new BadRequestException(
        'A configuração deve possuir ao menos um critério ativo antes da publicação.',
      );
    }

    const totalWeight = configuration.criteria.reduce(
      (total, criterion) => total.plus(criterion.weight),
      new Prisma.Decimal(0),
    );

    if (!totalWeight.equals(new Prisma.Decimal(100))) {
      throw new BadRequestException(
        `A soma dos pesos dos critérios ativos deve ser 100.00. Total atual: ${totalWeight.toFixed(2)}.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.judgingConfiguration.updateMany({
        where: {
          categoryId: configuration.categoryId,
          purpose: configuration.purpose,
          status: JudgingConfigurationStatus.PUBLISHED,
          isActive: true,
          id: {
            not: configuration.id,
          },
        },
        data: {
          status: JudgingConfigurationStatus.ARCHIVED,
          isActive: false,
        },
      });

      const publishedConfiguration = await tx.judgingConfiguration.update({
        where: {
          id: configuration.id,
        },
        data: {
          status: JudgingConfigurationStatus.PUBLISHED,
        },
      });

      return this.mapToResponse(publishedConfiguration);
    });
  }

  async createVersion(
    configurationId: string,
    dto: CreateJudgingConfigurationVersionDto,
  ): Promise<JudgingConfigurationResponseDto> {
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const sourceConfiguration = await tx.judgingConfiguration.findFirst({
            where: {
              id: configurationId,
              isActive: true,
            },
            include: {
              criteria: {
                where: {
                  isActive: true,
                },
                orderBy: {
                  order: 'asc',
                },
              },
            },
          });

          if (!sourceConfiguration) {
            throw new NotFoundException(
              'Configuração de julgamento não encontrada ou inativa.',
            );
          }

          if (
            sourceConfiguration.status !== JudgingConfigurationStatus.PUBLISHED
          ) {
            throw new BadRequestException(
              'Uma nova versão só pode ser criada a partir de uma configuração PUBLISHED.',
            );
          }

          const latestVersion = await tx.judgingConfiguration.aggregate({
            where: {
              categoryId: sourceConfiguration.categoryId,
              purpose: sourceConfiguration.purpose,
            },
            _max: {
              version: true,
            },
          });

          const nextVersion = (latestVersion._max.version ?? 0) + 1;

          const versionName =
            dto.name?.trim() || `${sourceConfiguration.name} — V${nextVersion}`;

          const newConfiguration = await tx.judgingConfiguration.create({
            data: {
              categoryId: sourceConfiguration.categoryId,
              name: versionName,
              interfaceType: sourceConfiguration.interfaceType,
              purpose: sourceConfiguration.purpose,
              status: JudgingConfigurationStatus.DRAFT,
              version: nextVersion,
              isActive: true,
              criteria: {
                create: sourceConfiguration.criteria.map((criterion) => ({
                  code: criterion.code,
                  name: criterion.name,
                  description: criterion.description,
                  weight: criterion.weight,
                  order: criterion.order,
                  minScore: criterion.minScore,
                  maxScore: criterion.maxScore,
                  isActive: true,
                })),
              },
            },
          });

          return this.mapToResponse(newConfiguration);
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Não foi possível criar a nova versão porque já existe uma versão com esse número para esta categoria e finalidade.',
        );
      }

      throw error;
    }
  }

  async updateCriterion(
    configurationId: string,
    criterionId: string,
    dto: UpdateJudgeCriterionDto,
  ): Promise<JudgeCriterionResponseDto> {
    await this.getDraftConfigurationOrThrow(configurationId);

    const currentCriterion = await this.getActiveCriterionOrThrow(
      configurationId,
      criterionId,
    );

    const minScore =
      dto.minScore !== undefined
        ? new Prisma.Decimal(dto.minScore)
        : currentCriterion.minScore;

    const maxScore =
      dto.maxScore !== undefined
        ? new Prisma.Decimal(dto.maxScore)
        : currentCriterion.maxScore;

    if (maxScore.lessThanOrEqualTo(minScore)) {
      throw new BadRequestException('maxScore deve ser maior que minScore.');
    }

    if (dto.order !== undefined && dto.order !== currentCriterion.order) {
      const criterionWithSameOrder = await this.prisma.judgeCriterion.findFirst(
        {
          where: {
            judgingConfigurationId: configurationId,
            order: dto.order,
            isActive: true,
            id: {
              not: criterionId,
            },
          },
        },
      );

      if (criterionWithSameOrder) {
        throw new ConflictException(
          'Já existe um critério ativo com esta ordem na configuração.',
        );
      }
    }

    try {
      const criterion = await this.prisma.judgeCriterion.update({
        where: {
          id: criterionId,
        },
        data: {
          ...(dto.name !== undefined && {
            name: dto.name.trim(),
          }),
          ...(dto.description !== undefined && {
            description: dto.description?.trim() || null,
          }),
          ...(dto.weight !== undefined && {
            weight: new Prisma.Decimal(dto.weight),
          }),
          ...(dto.order !== undefined && {
            order: dto.order,
          }),
          ...(dto.minScore !== undefined && {
            minScore,
          }),
          ...(dto.maxScore !== undefined && {
            maxScore,
          }),
        },
      });

      return this.mapCriterionToResponse(criterion);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um critério ativo com esta ordem na configuração.',
        );
      }

      throw error;
    }
  }

  async reorderCriteria(
    configurationId: string,
    dto: ReorderJudgeCriteriaDto,
  ): Promise<JudgeCriterionResponseDto[]> {
    return this.prisma.$transaction(async (tx) => {
      const configuration = await tx.judgingConfiguration.findFirst({
        where: {
          id: configurationId,
          isActive: true,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!configuration) {
        throw new NotFoundException(
          'Configuração de julgamento não encontrada ou inativa.',
        );
      }

      if (configuration.status !== JudgingConfigurationStatus.DRAFT) {
        throw new BadRequestException(
          'Critérios só podem ser alterados em configurações com status DRAFT.',
        );
      }

      const uniqueCriterionIds = new Set(dto.criterionIds);

      if (uniqueCriterionIds.size !== dto.criterionIds.length) {
        throw new BadRequestException(
          'A lista de critérios não pode conter IDs duplicados.',
        );
      }

      const activeCriteria = await tx.judgeCriterion.findMany({
        where: {
          judgingConfigurationId: configurationId,
          isActive: true,
        },
      });

      if (activeCriteria.length !== dto.criterionIds.length) {
        throw new BadRequestException(
          'A lista deve conter todos os critérios ativos da configuração exatamente uma vez.',
        );
      }

      const activeCriterionIds = new Set(
        activeCriteria.map((criterion) => criterion.id),
      );

      const hasInvalidCriterion = dto.criterionIds.some(
        (criterionId) => !activeCriterionIds.has(criterionId),
      );

      if (hasInvalidCriterion) {
        throw new BadRequestException(
          'A lista contém critério inexistente, inativo ou pertencente a outra configuração.',
        );
      }

      await Promise.all(
        dto.criterionIds.map((criterionId, index) =>
          tx.judgeCriterion.update({
            where: {
              id: criterionId,
            },
            data: {
              order: -(index + 1),
            },
          }),
        ),
      );

      await Promise.all(
        dto.criterionIds.map((criterionId, index) =>
          tx.judgeCriterion.update({
            where: {
              id: criterionId,
            },
            data: {
              order: index + 1,
            },
          }),
        ),
      );

      const reorderedCriteria = await tx.judgeCriterion.findMany({
        where: {
          judgingConfigurationId: configurationId,
          isActive: true,
        },
        orderBy: {
          order: 'asc',
        },
      });

      return reorderedCriteria.map((criterion) =>
        this.mapCriterionToResponse(criterion),
      );
    });
  }

  async deactivateCriterion(
    configurationId: string,
    criterionId: string,
  ): Promise<void> {
    await this.getDraftConfigurationOrThrow(configurationId);

    await this.getActiveCriterionOrThrow(configurationId, criterionId);

    await this.prisma.judgeCriterion.update({
      where: {
        id: criterionId,
      },
      data: {
        isActive: false,
      },
    });
  }

  private async getDraftConfigurationOrThrow(configurationId: string) {
    const configuration = await this.prisma.judgingConfiguration.findFirst({
      where: {
        id: configurationId,
        isActive: true,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!configuration) {
      throw new NotFoundException(
        'Configuração de julgamento não encontrada ou inativa.',
      );
    }

    if (configuration.status !== JudgingConfigurationStatus.DRAFT) {
      throw new BadRequestException(
        'Critérios só podem ser alterados em configurações com status DRAFT.',
      );
    }

    return configuration;
  }

  private async getActiveCriterionOrThrow(
    configurationId: string,
    criterionId: string,
  ) {
    const criterion = await this.prisma.judgeCriterion.findFirst({
      where: {
        id: criterionId,
        judgingConfigurationId: configurationId,
        isActive: true,
      },
    });

    if (!criterion) {
      throw new NotFoundException(
        'Critério ativo não encontrado para esta configuração.',
      );
    }

    return criterion;
  }

  private mapCriterionToResponse(
    criterion: Prisma.JudgeCriterionGetPayload<Record<string, never>>,
  ): JudgeCriterionResponseDto {
    return {
      id: criterion.id,
      judgingConfigurationId: criterion.judgingConfigurationId,
      code: criterion.code,
      name: criterion.name,
      description: criterion.description,
      weight: criterion.weight.toNumber(),
      order: criterion.order,
      minScore: criterion.minScore.toNumber(),
      maxScore: criterion.maxScore.toNumber(),
      isActive: criterion.isActive,
      createdAt: criterion.createdAt,
      updatedAt: criterion.updatedAt,
    };
  }

  private mapToResponse(
    configuration: Prisma.JudgingConfigurationGetPayload<Record<string, never>>,
  ): JudgingConfigurationResponseDto {
    return {
      id: configuration.id,
      categoryId: configuration.categoryId,
      name: configuration.name,
      interfaceType: configuration.interfaceType,
      purpose: configuration.purpose,
      status: configuration.status,
      version: configuration.version,
      isActive: configuration.isActive,
      createdAt: configuration.createdAt,
      updatedAt: configuration.updatedAt,
    };
  }
}
