import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { QuestionEntity } from "../../questions/entities/question.entity";
import { QuizEntity } from "../../quiz/entities/quiz.entity";

@Schema()
class QuizResultAnswer {
  @Prop({ required: true, type: Types.ObjectId, ref: QuestionEntity.name })
  readonly questionId: string;
  @Prop({ required: true })
  readonly label: string;
  @Prop({ required: true })
  readonly answer: string;
}

const quizResultAnswerSchema = SchemaFactory.createForClass(QuizResultAnswer);

@Schema()
class QuizResultStep {
  @Prop({
    type: [quizResultAnswerSchema]
  })
  readonly questions: QuizResultAnswer[];

}

const quizResultStepSchema = SchemaFactory.createForClass(QuizResultStep);


@Schema()
export class QuizResultEntity {
  @Prop({ required: true, type: Types.ObjectId, ref: QuizEntity.name })
  quizId: string;

  @Prop({
    type: [quizResultStepSchema]
  })
  steps: QuizResultStep[];
}
