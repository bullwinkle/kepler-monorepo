import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { Quiz, QuizResult } from "@kepler-monorepo/data";
import { API_URL } from "../constants";


@Injectable({
  providedIn: "root"
})
export class QuizApiService {
  base = new URL(document.baseURI).pathname;
  apiBase = API_URL;
  constructor(private httpClient: HttpClient) {
  }

  saveQuiz(quiz: Partial<QuizResult>) {
    return this.httpClient.post<void>(`${this.apiBase}/results`, { ...quiz });
  }

  getApiQuiz() {
    return this.httpClient.get<[Quiz]>(`${this.apiBase}/quiz`).pipe(map(([quiz]) => quiz));
  }
}
