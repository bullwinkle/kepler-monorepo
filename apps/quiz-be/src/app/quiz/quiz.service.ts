import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuizDocument } from "./quiz.schema";
import { QuizEntity } from "./entities/quiz.entity";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";

const initialQuiz = import("./initial-quiz.json").then(({ default: value }) => value);

@Injectable()
export class QuizService {
  constructor(@InjectModel(QuizEntity.name) private repo: Model<QuizDocument>) {
    this.init();
  }

  async init () {
    await this.repo.create(await initialQuiz);
  }

  async create(createQuizDto: CreateQuizDto) {
    return this.repo.create(createQuizDto);
  }

  async findAll() {
    return this.repo.find().exec();
  }

  async findOne(id: string) {
    return this.repo.findById(id).exec();
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    return this.repo.findByIdAndUpdate(id, updateQuizDto).exec();
  }

  async remove(id: string) {
    return this.repo.findByIdAndRemove(id).exec();
  }
}
