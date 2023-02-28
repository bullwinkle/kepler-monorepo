import { Controller, Delete, Get, Patch, Post, Put } from "@nestjs/common";
import { QuizService } from "./quiz.service";

@Controller("quiz")
export class QuizController {
  constructor(private quizService: QuizService) {
  }

  @Get()
  getQuizQuestions() {
    return this.quizService.getQuiz();
  }

  @Get()
  getQuiz() {
    return this.quizService.getQuiz();
  }

  @Post()
  saveQuiz() {
    return this.quizService.getQuiz();
  }

  @Put()
  updateQuiz() {
    return this.quizService.getQuiz();
  }

  @Patch()
  patchQuiz() {
    return this.quizService.getQuiz();
  }

  @Delete()
  deleteQuiz() {
    return this.quizService.getQuiz();
  }
}
