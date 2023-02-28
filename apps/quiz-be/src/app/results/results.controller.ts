import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { ResultsService } from "./results.service";
import { CreateResultDto } from "./dto/create-result.dto";
import { UpdateResultDto } from "./dto/update-result.dto";

@Controller('results')
export class ResultsController {
  constructor(public readonly service: ResultsService) {
  }

  @Post()
  async create(@Body() createResponseDto: CreateResultDto) {
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
  async update(@Param('id') id: string, @Body() updateResponseDto: UpdateResultDto) {
    return this.service.update(id, updateResponseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
