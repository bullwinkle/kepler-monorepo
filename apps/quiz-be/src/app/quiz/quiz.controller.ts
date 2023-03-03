import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { QuizService } from "./quiz.service";
import { AppSSEService } from "../app-sse.service";
import { SSEType } from "@kepler-monorepo/data";
import { Request } from "express";

@Controller('quiz')
export class QuizController {
  constructor(public readonly service: QuizService, private appSSEService: AppSSEService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.service.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto, @Req() request: Request) {
    this.appSSEService.sendMessage({type: SSEType.QUIZ_UPDATE, sessionId: request.sessionID, quiz: updateQuizDto});
    return this.service.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
