import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { BracketsService } from './brackets.service';
import { CreateBracketDto } from './dto/create-bracket.dto';
import { BracketViewResponseDto } from './dto/bracket-view-response.dto';

@ApiTags('Brackets')
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
}
