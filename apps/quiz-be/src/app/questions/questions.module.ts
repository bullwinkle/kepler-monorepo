import { Module } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { QuestionsController } from "./questions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { questionSchema } from "./questions.schema";
import { QuestionEntity } from "./entities/question.entity";

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [
    MongooseModule.forFeature([
      { name: QuestionEntity.name, schema: questionSchema },
    ]),
  ]
})
export class QuestionsModule {}
