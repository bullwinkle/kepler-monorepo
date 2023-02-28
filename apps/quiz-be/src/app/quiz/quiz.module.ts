import { Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { quizSchema } from "./quiz.schema";
import { QuizEntity } from "./entities/quiz.entity";

@Module({
  controllers: [QuizController],
  providers: [QuizService],
  imports: [
    MongooseModule.forFeature([
      { name: QuizEntity.name, schema: quizSchema },
    ]),
  ]
})
export class QuizModule {
}
