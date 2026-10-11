import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JudgeScorecardService } from './judge-scorecard.service';
import { CreateJudgeScorecardDto } from './dto/create-judge-scorecard.dto';
import { UpdateJudgeCriterionScoreDto } from './dto/update-judge-criterion-score.dto';

@ApiTags('Judge Scorecards')
@Controller()
export class JudgeScorecardController {
  constructor(private readonly service: JudgeScorecardService) {}

  @Post('rounds/:roundId/scorecards')
  @ApiOperation({
    summary: 'Criar scorecard do juiz para um round',
    description:
      'Cria o scorecard do juiz e as notas iniciais por competidor e critério da configuração TRIAD publicada.',
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
  @ApiNotFoundResponse({
    description: 'Round ou configuração de julgamento não encontrada.',
  })
  create(
    @Param('roundId', new ParseUUIDPipe()) roundId: string,
    @Body() dto: CreateJudgeScorecardDto,
  ) {
    return this.service.createForRound(roundId, dto);
  }

  @Get('rounds/:roundId/scorecards')
  @ApiOperation({
    summary: 'Listar scorecards de um round',
  })
  @ApiParam({
    name: 'roundId',
    description: 'ID do round',
    example: 'be58a377-e6c7-489d-8d98-a80ff906ed7b',
  })
  @ApiOkResponse({
    description: 'Scorecards do round retornados com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Round não encontrado.',
  })
  findByRound(@Param('roundId', new ParseUUIDPipe()) roundId: string) {
    return this.service.findByRound(roundId);
  }

  @Get('scorecards/:scorecardId')
  @ApiOperation({
    summary: 'Buscar scorecard por ID',
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
  @ApiNotFoundResponse({
    description: 'Scorecard não encontrado ou inativo.',
  })
  findOne(@Param('scorecardId', new ParseUUIDPipe()) scorecardId: string) {
    return this.service.findOne(scorecardId);
  }

  @Patch('scorecards/:scorecardId/criterion-scores/:criterionScoreId')
  @ApiOperation({
    summary: 'Atualizar nota de um critério',
    description:
      'Atualiza uma nota enquanto o scorecard estiver em DRAFT. A nota deve respeitar a escala do critério.',
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
  @ApiNotFoundResponse({
    description: 'Scorecard ou nota não encontrada.',
  })
  updateCriterionScore(
    @Param('scorecardId', new ParseUUIDPipe()) scorecardId: string,
    @Param('criterionScoreId', new ParseUUIDPipe()) criterionScoreId: string,
    @Body() dto: UpdateJudgeCriterionScoreDto,
  ) {
    return this.service.updateCriterionScore(
      scorecardId,
      criterionScoreId,
      dto,
    );
  }

  @Post('scorecards/:scorecardId/submit')
  @ApiOperation({
    summary: 'Submeter scorecard',
    description:
      'Valida que o scorecard está completo e altera seu status de DRAFT para SUBMITTED.',
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
  @ApiNotFoundResponse({
    description: 'Scorecard não encontrado ou inativo.',
  })
  submit(@Param('scorecardId', new ParseUUIDPipe()) scorecardId: string) {
    return this.service.submit(scorecardId);
  }
}
