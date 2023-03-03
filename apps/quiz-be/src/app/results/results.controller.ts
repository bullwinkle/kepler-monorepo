import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from "@nestjs/common";
import { ResultsService } from "./results.service";
import { CreateResultDto } from "./dto/create-result.dto";
import { UpdateResultDto } from "./dto/update-result.dto";
import { SSEType } from "@kepler-monorepo/data";
import { Request } from "express";
import { AppSSEService } from "../app-sse.service";

@Controller('results')
export class ResultsController {
  constructor(public readonly service: ResultsService, private appSSEService: AppSSEService) {
  }

  @Post()
  async create(@Body() createResponseDto: CreateResultDto) {
    console.warn('create result', createResponseDto);
    return this.service.create(createResponseDto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateResponseDto: UpdateResultDto, @Req() request: Request) {
    this.appSSEService.sendMessage({type: SSEType.QUIZ_RESULT_UPDATE, sessionId: request.sessionID, quizResult: updateResponseDto});
    return this.service.update(id, updateResponseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
