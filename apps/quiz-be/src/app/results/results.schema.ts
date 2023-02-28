import { Document } from "mongoose";
import { QuizResultEntity } from "./entities/quiz-result.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type QuizResultDocument = QuizResultEntity & Document;
export const quizResultSchema = SchemaFactory.createForClass(QuizResultEntity);
