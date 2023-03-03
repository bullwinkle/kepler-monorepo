import { Injectable, OnDestroy } from "@angular/core";
import { Quiz, QuizResult, SSEType } from "@kepler-monorepo/data";
import { API_URL } from "../constants";
import { QuizWizardStateFacade } from "./quiz-wizard-state.service";

@Injectable()
export class QuizSseService implements OnDestroy {
  private sse = new EventSource(`${API_URL}/sse`);

  constructor(private quizWizardStateFacade: QuizWizardStateFacade) {
    this.sse.addEventListener("open", (e) => {
      console.log("EventSource open", e);
    });

    this.sse.addEventListener(SSEType.QUIZ_UPDATE, (e) => {
      console.log("EventSource QUIZ_UPDATE", e.data);
      const quiz = e.data as Quiz;
      this.quizWizardStateFacade.patchState({quiz});
    });

    this.sse.addEventListener(SSEType.QUIZ_RESULT_UPDATE, (e) => {
      console.log("EventSource QUIZ_RESULT_UPDATE", e.data);
      // TODO patch state form
    });

    this.sse.addEventListener("message", (e) => {
      console.log("EventSource message", e.data);
    });

    this.sse.addEventListener("error", (e) => {
      console.error("EventSource error", e);
    });
  }

  ngOnDestroy(): void {
    this.sse.close();
    console.warn('EventSource closed');
  }
}
