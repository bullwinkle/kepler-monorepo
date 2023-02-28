import { Document } from "mongoose";
import { QuestionEntity } from "./entities/question.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type QuestionDocument = QuestionEntity & Document;
export const questionSchema = SchemaFactory.createForClass(QuestionEntity);
