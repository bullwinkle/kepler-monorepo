import { Injectable } from "@angular/core";
import { Quiz } from "../interfaces";
import { HttpClient } from "@angular/common/http";
import { delay } from "rxjs";

interface QuizAnswer {
  id:    string;
  steps: Step[];
}

interface Step {
  id:        string;
  questions: Question[];
}

interface Question {
  id:     string;
  answer: string;
}


@Injectable({
  providedIn: "root"
})
export class QuizApiService {
  constructor(private httpClient: HttpClient) {
  }

  saveQuiz(quiz: Partial<QuizAnswer>) {
    return this.httpClient.post<void>("/assets/mocks.json", { quiz });
  }

  getQuiz() {
    return this.httpClient.get<Quiz>("/assets/mocks.json").pipe(
      delay(1000) // TODO remove
    );
  }
}
