// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: {
        eventId: dto.eventId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        rules: dto.rules,
        minAge: dto.minAge,
        maxAge: dto.maxAge,
        level: dto.level,
        isTeam: dto.isTeam ?? false,
      },
    });
  }

  async findAllByEvent(eventId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { eventId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    // garante que existe antes de atualizar
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async deactivate(id: string): Promise<Category> {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
