// src/categories/categories.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Category, RoleName } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@ApiBearerAuth('Bearer')
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado',
})
@ApiForbiddenResponse({
  description: 'Usuário autenticado sem permissão para acessar este recurso',
})
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Criar categoria em um evento' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(dto);
  }

  @ApiOperation({ summary: 'Listar categorias de um evento' })
  @ApiOkResponse({
    description: 'Lista de categorias',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get('event/:eventId')
  async findAllByEvent(@Param('eventId') eventId: string): Promise<Category[]> {
    return this.categoriesService.findAllByEvent(eventId);
  }

  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiOkResponse({
    description: 'Categoria encontrada',
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiOkResponse({
    description: 'Categoria atualizada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Desativar categoria' })
  @ApiOkResponse({
    description: 'Categoria desativada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.deactivate(id);
  }
}
