import { Document } from "mongoose";
import { QuizEntity } from "./entities/quiz.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type QuizDocument = QuizEntity & Document;
export const quizSchema = SchemaFactory.createForClass(QuizEntity);
