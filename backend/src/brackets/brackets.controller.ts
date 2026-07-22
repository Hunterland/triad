// src/brackets/brackets.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BracketsService } from './brackets.service';
import { CreateBracketDto } from './dto/create-bracket.dto';
import { Roles } from '../auth/roles.decorator';
import { RoleName } from '@prisma/client';

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
  findByEventAndCategory(
    @Param('eventId') eventId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.bracketsService.findByEventAndCategory(eventId, categoryId);
  }
}
