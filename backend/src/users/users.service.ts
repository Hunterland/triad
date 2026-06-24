// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Serviço responsável pelas regras de negócio relacionadas aos usuários.
 *
 * Responsabilidades:
 * - Consultar usuários no banco de dados;
 * - Criar novos usuários e associar papéis (roles);
 * - Atualizar informações dos usuários;
 * - Realizar desativação lógica (soft delete);
 * - Definir quais campos serão expostos em cada consulta.
 *
 * Observação:
 * Todas as operações de persistência são realizadas através do PrismaService.
 */
@Injectable()
export class UsersService {
  /**
   * Injeta o PrismaService responsável pela comunicação com o banco.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca um usuário pelo e-mail.
   *
   * Utilizado principalmente durante o processo de autenticação.
   *
   * Inclui:
   * - Relacionamentos da tabela UserRole;
   * - Dados completos das roles associadas ao usuário.
   *
   * @param email E-mail do usuário.
   * @returns Usuário encontrado ou null.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Busca um usuário através do identificador.
   *
   * Inclui:
   * - Relacionamentos da tabela UserRole;
   * - Informações das roles do usuário.
   *
   * @param id Identificador do usuário.
   * @returns Usuário encontrado ou null.
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Cria um novo usuário e associa suas roles.
   *
   * Caso nenhuma role seja enviada,
   * o usuário recebe ATHLETE como padrão.
   *
   * Fluxo:
   * 1. Cria o usuário.
   * 2. Associa as roles informadas.
   * 3. Retorna o usuário com os relacionamentos carregados.
   *
   * @param params Dados do usuário.
   * @returns Usuário criado.
   */
  async createUserWithRoles(params: {
    email: string;
    passwordHash: string;
    displayName?: string;
    roles?: RoleName[];
  }) {
    const {
      email,
      passwordHash,
      displayName,
      roles = [RoleName.ATHLETE],
    } = params;

    return this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        displayName,

        /**
         * Cria registros na tabela intermediária UserRole,
         * associando cada role ao usuário.
         */
        roles: {
          create: roles.map((name) => ({
            role: {
              connect: { name },
            },
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Lista todos os usuários cadastrados.
   *
   * Utiliza select para controlar exatamente quais campos
   * serão expostos na resposta.
   *
   * @returns Coleção de usuários.
   */
  async listAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,

        /**
         * Retorna também as roles associadas ao usuário.
         */
        roles: {
          select: {
            userId: true,
            roleId: true,
            createdAt: true,
            role: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Busca um usuário para exposição pública.
   *
   * A consulta utiliza select para limitar os dados retornados.
   *
   * @param id Identificador do usuário.
   * @returns Usuário encontrado.
   */
  async findPublicById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            userId: true,
            roleId: true,
            createdAt: true,
            role: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Atualiza informações de um usuário.
   *
   * Permite alterar:
   * - displayName;
   * - isActive.
   *
   * Fluxo:
   * 1. Localiza o usuário pelo id.
   * 2. Atualiza apenas os campos enviados.
   * 3. Retorna os dados atualizados.
   *
   * @param id Identificador do usuário.
   * @param data Dados para atualização.
   * @returns Usuário atualizado.
   */
  async updateUser(
    id: string,
    data: {
      displayName?: string;
      isActive?: boolean;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            userId: true,
            roleId: true,
            createdAt: true,
            role: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Realiza uma desativação lógica do usuário.
   *
   * Importante:
   * O registro não é removido do banco.
   * Apenas o campo isActive é atualizado para false.
   *
   * Reaproveita o método updateUser para evitar duplicação de código.
   *
   * @param id Identificador do usuário.
   * @returns Usuário desativado.
   */
  async deactivateUser(id: string) {
    return this.updateUser(id, { isActive: false });
  }
}
