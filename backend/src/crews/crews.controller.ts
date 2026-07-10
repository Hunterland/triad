// src/crews/crews.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CrewsService } from './crews.service';
import { AddCrewMemberDto } from './dto/add-crew-member.dto';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';

@ApiTags('crews')
@ApiBearerAuth('Bearer')
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado',
})
@ApiForbiddenResponse({
  description: 'Usuário autenticado sem permissão para acessar este recurso',
})
@Controller('crews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @ApiOperation({ summary: 'Criar crew' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Post()
  async create(@Body() dto: CreateCrewDto) {
    return this.crewsService.create(dto);
  }

  @ApiOperation({ summary: 'Listar crews' })
  @ApiOkResponse({ description: 'Lista de crews cadastradas' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get()
  async findAll() {
    return this.crewsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar crew por ID' })
  @ApiOkResponse({ description: 'Crew encontrada' })
  @ApiNotFoundResponse({ description: 'Crew não encontrada' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.crewsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar crew' })
  @ApiOkResponse({ description: 'Crew atualizada com sucesso' })
  @ApiNotFoundResponse({ description: 'Crew não encontrada' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCrewDto) {
    return this.crewsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Desativar crew' })
  @ApiOkResponse({ description: 'Crew desativada com sucesso' })
  @ApiNotFoundResponse({ description: 'Crew não encontrada' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.crewsService.deactivate(id);
  }

  @ApiOperation({ summary: 'Adicionar membro à crew' })
  @ApiOkResponse({ description: 'Membro adicionado com sucesso' })
  @ApiNotFoundResponse({
    description: 'Crew não encontrada ou atleta não encontrado',
  })
  @ApiConflictResponse({
    description: 'Atleta já pertence a esta crew',
  })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Post(':id/members')
  async addMember(@Param('id') id: string, @Body() dto: AddCrewMemberDto) {
    return this.crewsService.addMember(id, dto);
  }

  @ApiOperation({ summary: 'Remover membro da crew' })
  @ApiOkResponse({ description: 'Membro removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Membro não encontrado na crew' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Delete(':id/members/:athleteId')
  async removeMember(
    @Param('id') id: string,
    @Param('athleteId') athleteId: string,
  ) {
    return this.crewsService.removeMember(id, athleteId);
  }
}
