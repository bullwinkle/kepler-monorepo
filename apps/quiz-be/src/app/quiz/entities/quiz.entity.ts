import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
class QuizAnswer {
  @Prop({ required: true })
  label: string;
  @Prop({ required: true })
  controlType: string;
  @Prop({ required: false })
  options?: string[];
}

const quizAnswerSchema = SchemaFactory.createForClass(QuizAnswer);

@Schema()
class QuizStep {
  @Prop()
  title: string;
  @Prop()
  description: string;

  @Prop({
    type: [quizAnswerSchema]
  })
  readonly questions: QuizAnswer[];
}

const quizStepSchema = SchemaFactory.createForClass(QuizStep);

@Schema()
export class QuizEntity {
  @Prop({
    type: [quizStepSchema]
  })
  steps: QuizStep[];
}
