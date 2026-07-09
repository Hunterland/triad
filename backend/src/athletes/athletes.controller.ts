// src/athletes/athletes.controller.ts
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
import { Athlete, RoleName } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

@ApiTags('athletes')
@ApiBearerAuth('Bearer')
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado',
})
@ApiForbiddenResponse({
  description: 'Usuário autenticado sem permissão para acessar este recurso',
})
@Controller('athletes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AthletesController {
  constructor(private readonly athletesService: AthletesService) {}

  @ApiOperation({ summary: 'Criar atleta' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Post()
  async create(@Body() dto: CreateAthleteDto): Promise<Athlete> {
    return this.athletesService.create(dto);
  }

  @ApiOperation({ summary: 'Listar atletas' })
  @ApiOkResponse({ description: 'Lista de atletas cadastrados' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get()
  async findAll(): Promise<Athlete[]> {
    return this.athletesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar atleta por ID' })
  @ApiOkResponse({ description: 'Atleta encontrado' })
  @ApiNotFoundResponse({ description: 'Atleta não encontrado' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Athlete> {
    return this.athletesService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar atleta' })
  @ApiOkResponse({ description: 'Atleta atualizado com sucesso' })
  @ApiNotFoundResponse({ description: 'Atleta não encontrado' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAthleteDto,
  ): Promise<Athlete> {
    return this.athletesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Desativar atleta' })
  @ApiOkResponse({ description: 'Atleta desativado com sucesso' })
  @ApiNotFoundResponse({ description: 'Atleta não encontrado' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<Athlete> {
    return this.athletesService.deactivate(id);
  }
}
