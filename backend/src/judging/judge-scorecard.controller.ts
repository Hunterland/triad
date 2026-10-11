import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JudgeScorecardService } from './judge-scorecard.service';
import { CreateJudgeScorecardDto } from './dto/create-judge-scorecard.dto';

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
  create(
    @Param('roundId') roundId: string,
    @Body() dto: CreateJudgeScorecardDto,
  ) {
    return this.service.createForRound(roundId, dto);
  }

  @Get('rounds/:roundId/scorecards')
  @ApiOperation({
    summary: 'Listar scorecards de um round',
  })
  findByRound(@Param('roundId') roundId: string) {
    return this.service.findByRound(roundId);
  }
}
