import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";

@Controller('questions')
export class QuestionsController {
  constructor(public readonly service: QuestionsService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.service.create(createQuestionDto);
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
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.service.update(id, updateQuestionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
