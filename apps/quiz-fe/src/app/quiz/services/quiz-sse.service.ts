import { Injectable, OnDestroy } from "@angular/core";
import { SSEType } from "@kepler-monorepo/data";
import { API_URL } from "../constants";

@Injectable()
export class QuizSseService implements OnDestroy {
  private sse = new EventSource(`${API_URL}/sse`);

  constructor() {
    this.sse.addEventListener("open", (e) => {
      console.log("EventSource open", e);
    });
    this.sse.addEventListener(SSEType.NOTICE, (e) => {
      console.log("EventSource notice", e.data);
    });
    this.sse.addEventListener(SSEType.UPDATE, (e) => {
      console.log("EventSource update", e.data);
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
    console.warn('sse closed');
  }
}
