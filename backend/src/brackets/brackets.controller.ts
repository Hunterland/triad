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
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { BracketsService } from './brackets.service';
import { BracketViewResponseDto } from './dto/bracket-view-response.dto';
import { CreateBracketDto } from './dto/create-bracket.dto';
import { CreateRoundsDto } from './dto/create-rounds.dto';
import { RoundResponseDto } from './dto/round-response.dto';
import { UpdateBattleStatusDto } from './dto/update-battle-status.dto';
import { UpdateRoundStatusDto } from './dto/update-round-status.dto';

@ApiTags('Brackets')
@ApiBearerAuth('Bearer')
@Controller('brackets')
export class BracketsController {
  constructor(private readonly bracketsService: BracketsService) {}

  @Post('generate')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  generate(@Body() dto: CreateBracketDto) {
    return this.bracketsService.generate(dto);
  }

  @Get('event/:eventId/category/:categoryId')
  @ApiOperation({
    summary: 'Visualizar chave por evento e categoria',
    description:
      'Retorna a chave ativa com evento, categoria e batalhas associadas.',
  })
  @ApiParam({
    name: 'eventId',
    description: 'ID do evento',
    example: 'ebf63b0c-e2d4-4178-a7b6-755b44584faa',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID da categoria',
    example: '4a47b7d5-3945-4d60-9cb1-8e9b5b7e2df1',
  })
  @ApiOkResponse({
    description: 'Chave encontrada com sucesso.',
    type: BracketViewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Nenhuma chave ativa encontrada para este evento e categoria.',
  })
  findByEventAndCategory(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ): Promise<BracketViewResponseDto> {
    return this.bracketsService.findByEventAndCategory(eventId, categoryId);
  }

  @Patch('battles/:battleId/status')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Atualizar status de uma batalha',
    description:
      'Atualiza o status operacional da batalha. Transições permitidas: PENDING → ONGOING → FINISHED.',
  })
  @ApiParam({
    name: 'battleId',
    description: 'ID da batalha',
    example: 'a8254f95-3002-4875-ba9e-32b69a8e4390',
  })
  @ApiOkResponse({
    description: 'Status da batalha atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'ID inválido, status inválido ou transição de status não permitida.',
  })
  @ApiNotFoundResponse({
    description: 'Batalha não encontrada ou inativa.',
  })
  updateBattleStatus(
    @Param('battleId', new ParseUUIDPipe()) battleId: string,
    @Body() dto: UpdateBattleStatusDto,
  ) {
    return this.bracketsService.updateBattleStatus(battleId, dto.status);
  }

  @Post('battles/:battleId/rounds')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Criar rounds para uma batalha',
    description:
      'Cria rounds sequenciais para uma batalha ativa com status PENDING. Os rounds são criados com status PENDING.',
  })
  @ApiParam({
    name: 'battleId',
    description: 'ID da batalha',
    example: 'a8254f95-3002-4875-ba9e-32b69a8e4390',
  })
  @ApiCreatedResponse({
    description: 'Rounds criados com sucesso.',
    type: [RoundResponseDto],
  })
  @ApiBadRequestResponse({
    description:
      'ID inválido, quantidade inválida ou batalha fora do status PENDING.',
  })
  @ApiNotFoundResponse({
    description: 'Batalha não encontrada ou inativa.',
  })
  @ApiConflictResponse({
    description: 'A batalha já possui rounds ativos.',
  })
  createRounds(
    @Param('battleId', new ParseUUIDPipe()) battleId: string,
    @Body() dto: CreateRoundsDto,
  ): Promise<RoundResponseDto[]> {
    return this.bracketsService.createRounds(battleId, dto.quantity);
  }

  @Get('battles/:battleId/rounds')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Listar rounds de uma batalha',
    description: 'Retorna os rounds ativos de uma batalha em ordem crescente.',
  })
  @ApiParam({
    name: 'battleId',
    description: 'ID da batalha',
    example: 'a8254f95-3002-4875-ba9e-32b69a8e4390',
  })
  @ApiOkResponse({
    description: 'Rounds encontrados com sucesso.',
    type: [RoundResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'ID da batalha inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Batalha não encontrada ou inativa.',
  })
  findRoundsByBattle(
    @Param('battleId', new ParseUUIDPipe()) battleId: string,
  ): Promise<RoundResponseDto[]> {
    return this.bracketsService.findRoundsByBattle(battleId);
  }

  @Patch('rounds/:roundId/status')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Atualizar status de um round',
    description:
      'Atualiza o status operacional do round. Transições permitidas: PENDING → ONGOING → FINISHED. O round só pode iniciar se a batalha estiver ONGOING e, para rounds posteriores, se o anterior estiver FINISHED.',
  })
  @ApiParam({
    name: 'roundId',
    description: 'ID do round',
    example: 'be58a377-e6c7-489d-8d98-a80ff906ed7b',
  })
  @ApiOkResponse({
    description: 'Status do round atualizado com sucesso.',
    type: RoundResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'ID inválido, status inválido, transição não permitida ou pré-requisito operacional não atendido.',
  })
  @ApiNotFoundResponse({
    description: 'Round não encontrado ou inativo.',
  })
  updateRoundStatus(
    @Param('roundId', new ParseUUIDPipe()) roundId: string,
    @Body() dto: UpdateRoundStatusDto,
  ): Promise<RoundResponseDto> {
    return this.bracketsService.updateRoundStatus(roundId, dto.status);
  }
}
