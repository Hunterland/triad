// src/users/users.controller.ts
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleName } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth('Bearer')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Listar usuários' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get()
  async list() {
    return this.usersService.listAll();
  }

  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findPublicById(id);
  }

  @ApiOperation({ summary: 'Atualizar usuário' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'Desativar usuário' })
  @Roles(RoleName.ADMIN)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }
}
