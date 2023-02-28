import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { QuizResultDocument } from "./results.schema";
import { Model } from "mongoose";
import { CreateResultDto } from "./dto/create-result.dto";
import { UpdateResultDto } from "./dto/update-result.dto";
import { QuizResultEntity } from "./entities/quiz-result.entity";

const mock = import("./mocks.json").then(({ default: value }) => value);

@Injectable()
export class ResultsService {
  constructor(@InjectModel(QuizResultEntity.name) private repo: Model<QuizResultDocument>) {
  }

  async create(createResponseDto: CreateResultDto) {
    return this.repo.create(createResponseDto);
  }

  async findAll() {
    return this.repo.find().exec();
  }

  async findOne(id: string) {
    return this.repo.findById(id).exec();
  }

  async update(id: string, updateResponseDto: UpdateResultDto) {
    return this.repo.findByIdAndUpdate(id, updateResponseDto).exec();
  }

  async remove(id: string) {
    return this.repo.findByIdAndRemove(id).exec();
  }
}
