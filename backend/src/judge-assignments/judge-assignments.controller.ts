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
import { RoleName } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CreateJudgeAssignmentDto } from './dto/create-judge-assignment.dto';
import { JudgeAssignmentResponseDto } from './dto/judge-assignment-response.dto';
import { JudgeAssignmentsService } from './judge-assignments.service';

@ApiTags('Judge Assignments')
@Controller('judge-assignments')
export class JudgeAssignmentsController {
  constructor(
    private readonly judgeAssignmentsService: JudgeAssignmentsService,
  ) {}

  @Post('category/:categoryId')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Atribuir juiz a uma categoria',
    description:
      'Atribui um vínculo EventStaff com papel JUDGE a uma categoria do mesmo evento.',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID da categoria',
    example: 'c80ca68b-77cd-4cad-8f05-ff431eb6b45b',
  })
  @ApiCreatedResponse({
    description: 'Juiz atribuído à categoria com sucesso.',
    type: JudgeAssignmentResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'O vínculo não possui papel JUDGE, o juiz está inativo ou pertence a outro evento.',
  })
  @ApiNotFoundResponse({
    description: 'Categoria ou vínculo de staff não encontrado/inativo.',
  })
  @ApiConflictResponse({
    description: 'Este juiz já possui atribuição ativa nesta categoria.',
  })
  create(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body() dto: CreateJudgeAssignmentDto,
  ): Promise<JudgeAssignmentResponseDto> {
    return this.judgeAssignmentsService.create(categoryId, dto);
  }

  @Get('category/:categoryId')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER, RoleName.JUDGE)
  @ApiOperation({
    summary: 'Listar juízes de uma categoria',
    description:
      'Retorna as atribuições ativas de juízes para uma categoria ativa.',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID da categoria',
    example: 'c80ca68b-77cd-4cad-8f05-ff431eb6b45b',
  })
  @ApiOkResponse({
    description: 'Juízes da categoria encontrados com sucesso.',
    type: [JudgeAssignmentResponseDto],
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada ou inativa.',
  })
  findByCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ): Promise<JudgeAssignmentResponseDto[]> {
    return this.judgeAssignmentsService.findByCategory(categoryId);
  }

  @Patch('category/:categoryId/:assignmentId/deactivate')
  @Roles(RoleName.ADMIN, RoleName.ORGANIZER)
  @ApiOperation({
    summary: 'Desativar atribuição de juiz',
    description:
      'Realiza soft delete da atribuição ativa de um juiz em uma categoria.',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID da categoria',
    example: 'c80ca68b-77cd-4cad-8f05-ff431eb6b45b',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'ID da atribuição de juiz',
    example: 'e0c35ce7-4b5b-412b-ac9c-407a195bffb4',
  })
  @ApiOkResponse({
    description: 'Atribuição de juiz desativada com sucesso.',
    type: JudgeAssignmentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros inválidos.',
  })
  @ApiNotFoundResponse({
    description:
      'Atribuição não encontrada, já inativa ou não pertence à categoria informada.',
  })
  deactivate(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Param('assignmentId', new ParseUUIDPipe()) assignmentId: string,
  ): Promise<JudgeAssignmentResponseDto> {
    return this.judgeAssignmentsService.deactivate(categoryId, assignmentId);
  }
}
