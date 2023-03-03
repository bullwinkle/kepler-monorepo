import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuizApiService } from "../../../services/quiz-api.service";

@Component({
  selector: "kepler-monorepo-quiz-results-list",
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>Quiz results</p>
    
    <ng-container *ngIf="list$ | async as list">
      <pre>{{ list | json }}</pre>
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
