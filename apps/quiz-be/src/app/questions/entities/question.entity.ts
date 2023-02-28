import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class QuestionEntity  {
  @Prop()
  label: string ;

  @Prop()
  type: string ;
}
