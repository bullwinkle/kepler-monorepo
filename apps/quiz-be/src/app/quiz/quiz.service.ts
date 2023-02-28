import { Injectable } from "@nestjs/common";

@Injectable()
export class QuizService {
  getQuiz(): { message: string } {
    return ({ message: "BE: getQuiz!" });
  }


  saveQuiz(): { message: string } {
    return ({ message: "BE: saveQuiz!" });
  }


  updateQuiz(): { message: string } {
    return ({ message: "BE: updateQuiz!" });
  }


  patchQuiz(): { message: string } {
    return ({ message: "BE: patchQuiz!" });
  }


  deleteQuiz(): { message: string } {
    return ({ message: "BE: deleteQuiz!" });
  }

}
