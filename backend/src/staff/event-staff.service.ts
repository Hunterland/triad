import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventStaffDto } from './dto/create-event-staff.dto';
import { UpdateEventStaffDto } from './dto/update-event-staff.dto';

@Injectable()
export class EventStaffService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureEventExists(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  private async ensureStaffMemberExists(staffMemberId: string) {
    const staffMember = await this.prisma.staffMember.findUnique({
      where: { id: staffMemberId },
    });

    if (!staffMember) {
      throw new NotFoundException('Staff member não encontrado');
    }

    return staffMember;
  }

  async create(eventId: string, dto: CreateEventStaffDto) {
    await this.ensureEventExists(eventId);
    await this.ensureStaffMemberExists(dto.staffMemberId);

    const existing = await this.prisma.eventStaff.findFirst({
      where: {
        eventId,
        staffMemberId: dto.staffMemberId,
        role: dto.role,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Este staff member já está vinculado a este evento com este papel',
      );
    }

    return this.prisma.eventStaff.create({
      data: {
        eventId,
        staffMemberId: dto.staffMemberId,
        role: dto.role,
        area: dto.area,
        order: dto.order,
        isLead: dto.isLead ?? false,
        isActive: dto.isActive ?? true,
      },
      include: {
        event: true,
        staffMember: true,
      },
    });
  }

  async findAllByEvent(eventId: string) {
    await this.ensureEventExists(eventId);

    return this.prisma.eventStaff.findMany({
      where: { eventId },
      include: {
        staffMember: true,
      },
      orderBy: [{ role: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(eventId: string, id: string) {
    await this.ensureEventExists(eventId);

    const assignment = await this.prisma.eventStaff.findFirst({
      where: {
        id,
        eventId,
      },
      include: {
        event: true,
        staffMember: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(
        'Vínculo de staff não encontrado para este evento',
      );
    }

    return assignment;
  }

  async update(eventId: string, id: string, dto: UpdateEventStaffDto) {
    const current = await this.findOne(eventId, id);

    if (dto.staffMemberId) {
      await this.ensureStaffMemberExists(dto.staffMemberId);
    }

    const nextStaffMemberId = dto.staffMemberId ?? current.staffMemberId;
    const nextRole = dto.role ?? current.role;

    const duplicated = await this.prisma.eventStaff.findFirst({
      where: {
        eventId,
        staffMemberId: nextStaffMemberId,
        role: nextRole,
        NOT: { id },
      },
    });

    if (duplicated) {
      throw new ConflictException(
        'Já existe vínculo com este staff member e papel neste evento',
      );
    }

    return this.prisma.eventStaff.update({
      where: { id },
      data: dto,
      include: {
        event: true,
        staffMember: true,
      },
    });
  }

  async deactivate(eventId: string, id: string) {
    await this.findOne(eventId, id);

    return this.prisma.eventStaff.update({
      where: { id },
      data: { isActive: false },
      include: {
        event: true,
        staffMember: true,
      },
    });
  }
}
