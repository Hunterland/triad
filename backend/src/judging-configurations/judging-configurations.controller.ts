// src/judging-configurations/judging-configurations.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CreateJudgeCriterionDto } from './dto/create-judge-criterion.dto';
import { CreateJudgingConfigurationDto } from './dto/create-judging-configuration.dto';
import { CreateJudgingConfigurationVersionDto } from './dto/create-judging-configuration-version.dto';
import { JudgeCriterionResponseDto } from './dto/judge-criterion-response.dto';
import { JudgingConfigurationResponseDto } from './dto/judging-configuration-response.dto';
import { ReorderJudgeCriteriaDto } from './dto/reorder-judge-criteria.dto';
import { UpdateJudgeCriterionDto } from './dto/update-judge-criterion.dto';
import { JudgingConfigurationsService } from './judging-configurations.service';

@ApiTags('Judging Configurations')
@Controller('judging-configurations')
export class JudgingConfigurationsController {
  constructor(
    private readonly judgingConfigurationsService: JudgingConfigurationsService,
  ) {}

  @Post('category/:categoryId')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Criar configuração de julgamento em rascunho',
    description:
      'Cria uma configuração de julgamento em estado DRAFT para uma categoria ativa.',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID da categoria',
    example: 'ada652bc-3a54-4dd5-a316-5b9d14014987',
  })
  @ApiCreatedResponse({
    description: 'Configuração de julgamento criada com sucesso.',
    type: JudgingConfigurationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros ou payload inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada ou inativa.',
  })
  @ApiConflictResponse({
    description: 'Conflito na criação da versão da configuração.',
  })
  create(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body() dto: CreateJudgingConfigurationDto,
  ): Promise<JudgingConfigurationResponseDto> {
    return this.judgingConfigurationsService.create(categoryId, dto);
  }

  @Get('category/:categoryId')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER, RoleName.JUDGE)
  @ApiOperation({
    summary: 'Listar configurações de julgamento de uma categoria',
    description:
      'Retorna as configurações ativas de julgamento da categoria, ordenadas por finalidade e versão.',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID da categoria',
    example: 'ada652bc-3a54-4dd5-a316-5b9d14014987',
  })
  @ApiOkResponse({
    description: 'Configurações encontradas com sucesso.',
    type: [JudgingConfigurationResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'ID de categoria inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada ou inativa.',
  })
  findByCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ): Promise<JudgingConfigurationResponseDto[]> {
    return this.judgingConfigurationsService.findByCategory(categoryId);
  }

  @Post(':configurationId/criteria')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Adicionar critério a uma configuração de julgamento',
    description:
      'Adiciona um critério ativo a uma configuração em estado DRAFT.',
  })
  @ApiParam({
    name: 'configurationId',
    description: 'ID da configuração de julgamento',
    example: '41ea9ce1-31fa-4598-aa18-995896d8cceb',
  })
  @ApiCreatedResponse({
    description: 'Critério criado com sucesso.',
    type: JudgeCriterionResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Payload inválido, escala inválida ou configuração fora do estado DRAFT.',
  })
  @ApiNotFoundResponse({
    description: 'Configuração não encontrada ou inativa.',
  })
  @ApiConflictResponse({
    description:
      'Já existe critério ativo com o mesmo código ou ordem nesta configuração.',
  })
  createCriterion(
    @Param('configurationId', new ParseUUIDPipe()) configurationId: string,
    @Body() dto: CreateJudgeCriterionDto,
  ): Promise<JudgeCriterionResponseDto> {
    return this.judgingConfigurationsService.createCriterion(
      configurationId,
      dto,
    );
  }

  @Get(':configurationId/criteria')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER, RoleName.JUDGE)
  @ApiOperation({
    summary: 'Listar critérios de uma configuração de julgamento',
    description: 'Retorna critérios ativos em ordem crescente de apresentação.',
  })
  @ApiParam({
    name: 'configurationId',
    description: 'ID da configuração de julgamento',
    example: '41ea9ce1-31fa-4598-aa18-995896d8cceb',
  })
  @ApiOkResponse({
    description: 'Critérios encontrados com sucesso.',
    type: [JudgeCriterionResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'ID de configuração inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Configuração não encontrada ou inativa.',
  })
  findCriteriaByConfiguration(
    @Param('configurationId', new ParseUUIDPipe()) configurationId: string,
  ): Promise<JudgeCriterionResponseDto[]> {
    return this.judgingConfigurationsService.findCriteriaByConfiguration(
      configurationId,
    );
  }

  @Post(':configurationId/publish')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Publicar configuração de julgamento',
    description:
      'Valida critérios e pesos, arquiva versão publicada anterior da mesma categoria/finalidade e publica a configuração em rascunho.',
  })
  @ApiParam({
    name: 'configurationId',
    description: 'ID da configuração de julgamento',
    example: '41ea9ce1-31fa-4598-aa18-995896d8cceb',
  })
  @ApiOkResponse({
    description: 'Configuração publicada com sucesso.',
    type: JudgingConfigurationResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Configuração fora de DRAFT, sem critérios ativos ou com pesos que não somam 100.00.',
  })
  @ApiNotFoundResponse({
    description: 'Configuração não encontrada ou inativa.',
  })
  publish(
    @Param('configurationId', new ParseUUIDPipe()) configurationId: string,
  ): Promise<JudgingConfigurationResponseDto> {
    return this.judgingConfigurationsService.publish(configurationId);
  }

  @Post(':configurationId/versions')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Criar nova versão de uma configuração de julgamento',
    description:
      'Cria uma nova configuração DRAFT a partir de uma versão PUBLISHED, copiando seus critérios ativos.',
  })
  @ApiParam({
    name: 'configurationId',
    description: 'ID da configuração publicada que servirá como origem',
    example: '41ea9ce1-31fa-4598-aa18-995896d8cceb',
  })
  @ApiBody({
    type: CreateJudgingConfigurationVersionDto,
    required: false,
  })
  @ApiOkResponse({
    description:
      'Nova versão DRAFT criada com sucesso, incluindo cópia dos critérios ativos.',
    type: JudgingConfigurationResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'A configuração de origem não está PUBLISHED ou os dados enviados são inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Configuração de origem não encontrada ou inativa.',
  })
  createVersion(
    @Param('configurationId', new ParseUUIDPipe()) configurationId: string,
    @Body() dto: CreateJudgingConfigurationVersionDto,
  ): Promise<JudgingConfigurationResponseDto> {
    return this.judgingConfigurationsService.createVersion(
      configurationId,
      dto ?? {},
    );
  }

  @Patch(':configurationId/criteria/reorder')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Reordenar critérios de julgamento',
    description:
      'Atualiza a ordem de todos os critérios ativos de uma configuração DRAFT.',
  })
  @ApiParam({
    name: 'configurationId',
    description: 'ID da configuração em DRAFT',
    example: '4bc5ebac-4e9f-4b17-b12b-8d9577686606',
  })
  @ApiOkResponse({
    description: 'Critérios reordenados com sucesso.',
    type: JudgeCriterionResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      'Configuração fora de DRAFT, IDs duplicados ou lista diferente dos critérios ativos.',
  })
  @ApiNotFoundResponse({
    description: 'Configuração não encontrada ou inativa.',
  })
  reorderCriteria(
    @Param('configurationId', new ParseUUIDPipe()) configurationId: string,
    @Body() dto: ReorderJudgeCriteriaDto,
  ): Promise<JudgeCriterionResponseDto[]> {
    return this.judgingConfigurationsService.reorderCriteria(
      configurationId,
      dto,
    );
  }

  @Patch(':configurationId/criteria/:criterionId')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Atualizar critério de julgamento',
    description:
      'Atualiza um critério ativo de uma configuração DRAFT. O código do critério é imutável.',
  })
  @ApiParam({
    name: 'configurationId',
    description: 'ID da configuração em DRAFT',
    example: '4bc5ebac-4e9f-4b17-b12b-8d9577686606',
  })
  @ApiParam({
    name: 'criterionId',
    description: 'ID do critério ativo',
    example: 'f4c87b4e-2250-4e83-85c7-55b67d1a1df0',
  })
  @ApiOkResponse({
    description: 'Critério atualizado com sucesso.',
    type: JudgeCriterionResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Configuração fora de DRAFT, payload inválido ou escala de notas inválida.',
  })
  @ApiConflictResponse({
    description: 'Já existe critério ativo com a ordem informada.',
  })
  @ApiNotFoundResponse({
    description:
      'Configuração não encontrada ou critério ativo não pertence à configuração.',
  })
  updateCriterion(
    @Param('configurationId', new ParseUUIDPipe()) configurationId: string,
    @Param('criterionId', new ParseUUIDPipe()) criterionId: string,
    @Body() dto: UpdateJudgeCriterionDto,
  ): Promise<JudgeCriterionResponseDto> {
    return this.judgingConfigurationsService.updateCriterion(
      configurationId,
      criterionId,
      dto,
    );
  }

  @Delete(':configurationId/criteria/:criterionId')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Desativar critério de julgamento',
    description:
      'Desativa um critério ativo de uma configuração DRAFT sem excluir seu histórico.',
  })
  @ApiParam({
    name: 'configurationId',
    description: 'ID da configuração em DRAFT',
    example: '4bc5ebac-4e9f-4b17-b12b-8d9577686606',
  })
  @ApiParam({
    name: 'criterionId',
    description: 'ID do critério ativo',
    example: 'f4c87b4e-2250-4e83-85c7-55b67d1a1df0',
  })
  @ApiNoContentResponse({
    description: 'Critério desativado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Configuração fora de DRAFT.',
  })
  @ApiNotFoundResponse({
    description:
      'Configuração não encontrada ou critério ativo não pertence à configuração.',
  })
  async deactivateCriterion(
    @Param('configurationId', new ParseUUIDPipe()) configurationId: string,
    @Param('criterionId', new ParseUUIDPipe()) criterionId: string,
  ): Promise<void> {
    await this.judgingConfigurationsService.deactivateCriterion(
      configurationId,
      criterionId,
    );
  }
}
