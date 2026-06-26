import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
        throw new ConflictException('Já existe um staff member com este email');
      }
    }

    return this.prisma.staffMember.create({
      data: {
        ...dto,
        isActive: dto.isActive ?? true,
      },
    });
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
      throw new NotFoundException('Staff member não encontrado');
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
        throw new ConflictException('Já existe um staff member com este email');
      }
    }

    return this.prisma.staffMember.update({
      where: { id },
      data: dto,
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.staffMember.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
