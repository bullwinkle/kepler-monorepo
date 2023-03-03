import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuizApiService } from "../../../services/quiz-api.service";

@Component({
  selector: "kepler-monorepo-quiz-results-list",
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="list$ | async as list">
      <h3>Quiz results ({{ list.length }})</h3>
  
      <ng-container *ngFor="let item of list$ | async; let i = index">
        <h4>{{ i }}</h4>
        <pre>{{ item | json }}</pre>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ["./quiz-results-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizResultsListComponent {
  list$ = this.quizApiService.getApiQuizResultsList();

  constructor(private quizApiService: QuizApiService) {
  }
}
