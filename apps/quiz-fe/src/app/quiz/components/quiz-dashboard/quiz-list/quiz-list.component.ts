import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizApiService } from "../../../services/quiz-api.service";

@Component({
  selector: 'kepler-monorepo-quiz-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>Quiz list</p>

    <ng-container *ngIf="list$ | async as list">
      <pre>{{ list | json }}</pre>
    </ng-container>
  `,
  styleUrls: ['./quiz-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizListComponent {
  list$ = this.quizApiService.getApiQuizList()

  constructor(private quizApiService: QuizApiService) {
  }
}
