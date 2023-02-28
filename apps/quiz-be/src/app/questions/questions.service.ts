import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionDocument } from "./questions.schema";
import { QuestionEntity } from "./entities/question.entity";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(QuestionEntity.name) private repo: Model<QuestionDocument>) {
    this.init();
  }

  async init () {
    await this.repo.create({label: 'what', type: 'input'});
    await this.repo.create({label: 'what', type: 'input'});
    await this.repo.create({label: 'what', type: 'input'});
    await this.repo.create({label: 'what', type: 'input'});
  }

  async create(createQuestionDto: CreateQuestionDto) {
    return this.repo.create(createQuestionDto);
  }

  async findAll() {
    return this.repo.find().exec();
  }

  async findOne(id: string) {
    return this.repo.findById(id).exec();
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return this.repo.findByIdAndUpdate(id, updateQuestionDto).exec();
  }

  async remove(id: string) {
    return this.repo.findByIdAndRemove(id).exec();
  }
}
