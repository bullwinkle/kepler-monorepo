import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class QuizResultEntity {
  @Prop({
    type: [{
      questions: {
        questionId: Types.ObjectId,
        label: String,
        answer: String
      }
    }]
  })
  steps: [{
    questions: {
      questionId: Types.ObjectId,
      label: string
      answer: string
    }
  }];
}
