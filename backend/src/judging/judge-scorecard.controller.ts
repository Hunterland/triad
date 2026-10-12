import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../auth/roles.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { JudgeScorecardService } from './judge-scorecard.service';
import { CreateJudgeScorecardDto } from './dto/create-judge-scorecard.dto';
import { UpdateJudgeCriterionScoreDto } from './dto/update-judge-criterion-score.dto';

type RequestWithUser = Request & {
  user: AuthenticatedUser;
};

@ApiTags('Judge Scorecards')
@ApiBearerAuth('Bearer')
@Controller()
export class JudgeScorecardController {
  constructor(private readonly service: JudgeScorecardService) {}

  @Post('rounds/:roundId/scorecards')
  @Roles(RoleName.JUDGE)
  @ApiOperation({
    summary: 'Criar o próprio scorecard para um round',
    description:
      'Cria scorecard para o juiz autenticado. A atribuição do juiz é determinada pelo JWT e não é recebida no body.',
  })
  @ApiParam({
    name: 'roundId',
    description: 'ID do round em andamento',
    example: 'be58a377-e6c7-489d-8d98-a80ff906ed7b',
  })
  @ApiCreatedResponse({
    description: 'Scorecard criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos, notas incompletas ou fora da escala.',
  })
  @ApiConflictResponse({
    description:
      'Batalha/round fora do estado necessário ou scorecard já existente.',
  })
  @ApiForbiddenResponse({
    description:
      'Usuário autenticado não possui atribuição ativa de juiz para a categoria.',
  })
  @ApiNotFoundResponse({
    description: 'Round ou configuração de julgamento não encontrada.',
  })
  create(
    @Param('roundId', new ParseUUIDPipe()) roundId: string,
    @Req() request: RequestWithUser,
    @Body() dto: CreateJudgeScorecardDto,
  ) {
    return this.service.createForRound(roundId, request.user.userId, dto);
  }

  @Get('rounds/:roundId/scorecards')
  @Roles(RoleName.JUDGE)
  @ApiOperation({
    summary: 'Listar os próprios scorecards de um round',
  })
  @ApiParam({
    name: 'roundId',
    description: 'ID do round',
    example: 'be58a377-e6c7-489d-8d98-a80ff906ed7b',
  })
  @ApiOkResponse({
    description: 'Scorecards próprios do round retornados com sucesso.',
  })
  @ApiForbiddenResponse({
    description:
      'Usuário autenticado não possui atribuição ativa de juiz para a categoria.',
  })
  @ApiNotFoundResponse({
    description: 'Round não encontrado.',
  })
  findByRound(
    @Param('roundId', new ParseUUIDPipe()) roundId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.service.findByRound(roundId, request.user.userId);
  }

  @Get('scorecards/:scorecardId')
  @Roles(RoleName.JUDGE)
  @ApiOperation({
    summary: 'Buscar o próprio scorecard por ID',
    description:
      'Retorna scorecard, juiz, round, configuração TRIAD e notas por competidor e critério.',
  })
  @ApiParam({
    name: 'scorecardId',
    description: 'ID do scorecard',
    example: '35096d7f-a79d-4c77-a365-4c7ebece2940',
  })
  @ApiOkResponse({
    description: 'Scorecard encontrado com sucesso.',
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui permissão para acessar este scorecard.',
  })
  @ApiNotFoundResponse({
    description: 'Scorecard não encontrado ou inativo.',
  })
  findOne(
    @Param('scorecardId', new ParseUUIDPipe()) scorecardId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.service.findOne(scorecardId, request.user.userId);
  }

  @Patch('scorecards/:scorecardId/criterion-scores/:criterionScoreId')
  @Roles(RoleName.JUDGE)
  @ApiOperation({
    summary: 'Atualizar nota do próprio scorecard',
    description:
      'Atualiza uma nota enquanto o scorecard do juiz autenticado estiver em DRAFT.',
  })
  @ApiParam({
    name: 'scorecardId',
    description: 'ID do scorecard em rascunho',
    example: '35096d7f-a79d-4c77-a365-4c7ebece2940',
  })
  @ApiParam({
    name: 'criterionScoreId',
    description: 'ID da nota por competidor e critério',
    example: 'c9897229-da1d-4644-9af2-de242bd765ca',
  })
  @ApiOkResponse({
    description: 'Nota atualizada com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Nota inválida ou fora da escala do critério.',
  })
  @ApiConflictResponse({
    description: 'O scorecard já foi submetido e não pode ser alterado.',
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui permissão para alterar este scorecard.',
  })
  @ApiNotFoundResponse({
    description: 'Scorecard ou nota não encontrada.',
  })
  updateCriterionScore(
    @Param('scorecardId', new ParseUUIDPipe()) scorecardId: string,
    @Param('criterionScoreId', new ParseUUIDPipe()) criterionScoreId: string,
    @Req() request: RequestWithUser,
    @Body() dto: UpdateJudgeCriterionScoreDto,
  ) {
    return this.service.updateCriterionScore(
      scorecardId,
      criterionScoreId,
      request.user.userId,
      dto,
    );
  }

  @Post('scorecards/:scorecardId/submit')
  @Roles(RoleName.JUDGE)
  @ApiOperation({
    summary: 'Submeter o próprio scorecard',
    description:
      'Valida que o scorecard do juiz autenticado está completo e altera seu status de DRAFT para SUBMITTED.',
  })
  @ApiParam({
    name: 'scorecardId',
    description: 'ID do scorecard em rascunho',
    example: '35096d7f-a79d-4c77-a365-4c7ebece2940',
  })
  @ApiOkResponse({
    description: 'Scorecard submetido com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Scorecard incompleto ou inválido.',
  })
  @ApiConflictResponse({
    description: 'Scorecard já foi submetido.',
  })
  @ApiForbiddenResponse({
    description: 'Usuário não possui permissão para submeter este scorecard.',
  })
  @ApiNotFoundResponse({
    description: 'Scorecard não encontrado ou inativo.',
  })
  submit(
    @Param('scorecardId', new ParseUUIDPipe()) scorecardId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.service.submit(scorecardId, request.user.userId);
  }
}
