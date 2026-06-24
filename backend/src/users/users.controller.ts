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

  /**
   * Lista todos os usuários cadastrados.
   *
   * Endpoint:
   * GET /users
   *
   * Fluxo:
   * 1. Verifica autenticação e autorização.
   * 2. Solicita ao UsersService todos os usuários.
   * 3. Retorna a coleção de usuários.
   *
   * @returns Lista de usuários.
   */
  @ApiOperation({ summary: 'Listar usuários' })
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @Get()
  async list() {
    return this.usersService.listAll();
  }

  /**
   * Busca um usuário através do seu identificador.
   *
   * Endpoint:
   * GET /users/:id
   *
   * @param id ID do usuário.
   * @returns Usuário encontrado.
   *
   * Pode lançar:
   * - NotFoundException caso o usuário não exista.
   */
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findPublicById(id);
  }

  /**
   * Atualiza um usuário existente.
   *
   * Endpoint:
   * PATCH /users/:id
   *
   * Permissões:
   * - ADMIN
   *
   * Fluxo:
   * 1. Recebe o id do usuário;
   * 2. Recebe os dados enviados no corpo da requisição;
   * 3. Encaminha a atualização para o UsersService;
   * 4. Retorna o usuário atualizado.
   *
   * Observação:
   * Apenas os campos enviados no DTO serão modificados.
   *
   * @param id Identificador do usuário.
   * @param dto Dados para atualização.
   * @returns Usuário atualizado.
   */
  @ApiOperation({ summary: 'Atualizar usuário' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  /**
   * Realiza uma desativação lógica do usuário.
   *
   * Endpoint:
   * PATCH /users/:id/deactivate
   *
   * Permissões:
   * - ADMIN
   *
   * Observação:
   * O usuário não é removido do banco de dados.
   * Apenas é marcado como inativo.
   *
   * Fluxo:
   * 1. Recebe o id do usuário;
   * 2. Solicita ao UsersService a desativação;
   * 3. Retorna o usuário atualizado.
   *
   * @param id Identificador do usuário.
   * @returns Usuário desativado.
   */
  @ApiOperation({ summary: 'Desativar usuário' })
  @Roles(RoleName.ADMIN)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }
}
