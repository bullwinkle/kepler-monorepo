import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class QuizEntity {
  @Prop({
    required: true,
    type: [
      {
        title: String,
        description: String,
        questions: [
          {
            label: String,
            controlType: String,
            options: [String]
          }
        ]
      }
    ]
  })
  steps: [{
    title: string;
    description: string,
    questions: [{
      label: string,
      controlType: string,
      type: string,
    }]
  }];
}
