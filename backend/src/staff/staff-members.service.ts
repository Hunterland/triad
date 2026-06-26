import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';

@Injectable()
export class StaffMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStaffMemberDto) {
    if (dto.email) {
      const existing = await this.prisma.staffMember.findUnique({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException(
          'Já existe um membro de staff com este email',
        );
      }
    }

    try {
      return await this.prisma.staffMember.create({
        data: {
          name: dto.name,
          stageName: dto.stageName,
          email: dto.email,
          phone: dto.phone,
          country: dto.country,
          city: dto.city,
          documentId: dto.documentId,
          defaultRole: dto.defaultRole,
          specialty: dto.specialty,
          isActive: dto.isActive ?? true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um membro de staff com este email',
        );
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.staffMember.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const staffMember = await this.prisma.staffMember.findUnique({
      where: { id },
    });

    if (!staffMember) {
      throw new NotFoundException('Membro de staff não encontrado');
    }

    return staffMember;
  }

  async update(id: string, dto: UpdateStaffMemberDto) {
    await this.findOne(id);

    if (dto.email) {
      const existing = await this.prisma.staffMember.findUnique({
        where: { email: dto.email },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Já existe um membro de staff com este email',
        );
      }
    }

    const data: Prisma.StaffMemberUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.stageName !== undefined && { stageName: dto.stageName }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.country !== undefined && { country: dto.country }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.documentId !== undefined && { documentId: dto.documentId }),
      ...(dto.defaultRole !== undefined && { defaultRole: dto.defaultRole }),
      ...(dto.specialty !== undefined && { specialty: dto.specialty }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    };

    try {
      return await this.prisma.staffMember.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um membro de staff com este email',
        );
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Membro de staff não encontrado');
      }

      throw error;
    }
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.staffMember.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
