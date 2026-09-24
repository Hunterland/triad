import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StaffRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJudgeAssignmentDto } from './dto/create-judge-assignment.dto';
import { JudgeAssignmentResponseDto } from './dto/judge-assignment-response.dto';

@Injectable()
export class JudgeAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    categoryId: string,
    dto: CreateJudgeAssignmentDto,
  ): Promise<JudgeAssignmentResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada ou inativa.');
    }

    const eventStaff = await this.prisma.eventStaff.findFirst({
      where: {
        id: dto.eventStaffId,
        isActive: true,
      },
      include: {
        staffMember: true,
      },
    });

    if (!eventStaff) {
      throw new NotFoundException(
        'Vínculo de staff não encontrado ou inativo.',
      );
    }

    if (eventStaff.role !== StaffRole.JUDGE) {
      throw new BadRequestException(
        'O vínculo de staff informado não possui o papel de JUDGE.',
      );
    }

    if (!eventStaff.staffMember.isActive) {
      throw new BadRequestException(
        'O membro de staff vinculado ao juiz está inativo.',
      );
    }

    if (eventStaff.eventId !== category.eventId) {
      throw new BadRequestException(
        'O juiz deve estar vinculado ao mesmo evento da categoria.',
      );
    }

    const existingAssignment = await this.prisma.judgeAssignment.findFirst({
      where: {
        eventStaffId: dto.eventStaffId,
        categoryId,
        isActive: true,
      },
    });

    if (existingAssignment) {
      throw new ConflictException(
        'Este juiz já possui uma atribuição ativa nesta categoria.',
      );
    }

    try {
      const assignment = await this.prisma.judgeAssignment.create({
        data: {
          eventStaffId: dto.eventStaffId,
          categoryId,
          isActive: true,
        },
        include: {
          eventStaff: {
            include: {
              staffMember: true,
            },
          },
        },
      });

      return this.mapToResponse(assignment);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Este juiz já possui uma atribuição nesta categoria.',
        );
      }

      throw error;
    }
  }

  async findByCategory(
    categoryId: string,
  ): Promise<JudgeAssignmentResponseDto[]> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada ou inativa.');
    }

    const assignments = await this.prisma.judgeAssignment.findMany({
      where: {
        categoryId,
        isActive: true,
        eventStaff: {
          isActive: true,
          role: StaffRole.JUDGE,
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
      orderBy: {
        createdAt: 'asc',
      },
    });

    return assignments.map((assignment) => this.mapToResponse(assignment));
  }

  async deactivate(
    categoryId: string,
    assignmentId: string,
  ): Promise<JudgeAssignmentResponseDto> {
    const assignment = await this.prisma.judgeAssignment.findFirst({
      where: {
        id: assignmentId,
        categoryId,
        isActive: true,
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
      throw new NotFoundException(
        'Atribuição de juiz não encontrada, inativa ou não pertence à categoria informada.',
      );
    }

    const updatedAssignment = await this.prisma.judgeAssignment.update({
      where: {
        id: assignment.id,
      },
      data: {
        isActive: false,
      },
      include: {
        eventStaff: {
          include: {
            staffMember: true,
          },
        },
      },
    });

    return this.mapToResponse(updatedAssignment);
  }

  private mapToResponse(
    assignment: Prisma.JudgeAssignmentGetPayload<{
      include: {
        eventStaff: {
          include: {
            staffMember: true;
          };
        };
      };
    }>,
  ): JudgeAssignmentResponseDto {
    return {
      id: assignment.id,
      eventStaffId: assignment.eventStaffId,
      categoryId: assignment.categoryId,
      isActive: assignment.isActive,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
      eventStaff: {
        id: assignment.eventStaff.id,
        eventId: assignment.eventStaff.eventId,
        role: assignment.eventStaff.role,
        area: assignment.eventStaff.area,
        order: assignment.eventStaff.order,
        isLead: assignment.eventStaff.isLead,
        isActive: assignment.eventStaff.isActive,
        staffMember: {
          id: assignment.eventStaff.staffMember.id,
          name: assignment.eventStaff.staffMember.name,
          stageName: assignment.eventStaff.staffMember.stageName,
          email: assignment.eventStaff.staffMember.email,
          isActive: assignment.eventStaff.staffMember.isActive,
        },
      },
    };
  }
}
