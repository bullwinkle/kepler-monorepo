import { Module } from "@nestjs/common";
import { ResultsService } from "./results.service";
import { ResultsController } from "./results.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { quizResultSchema } from "./results.schema";
import { QuizResultEntity } from "./entities/quiz-result.entity";

@Module({
  controllers: [ResultsController],
  providers: [ResultsService],
  imports: [
    MongooseModule.forFeature([
      { name: QuizResultEntity.name, schema: quizResultSchema }
    ])
  ]
})
export class ResultsModule {
}
