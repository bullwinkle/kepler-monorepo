import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizResultsListComponent } from "./quiz-results-list/quiz-results-list.component";
import { QuizListComponent } from "./quiz-list/quiz-list.component";

@Component({
  selector: 'kepler-monorepo-quiz-dashboard',
  standalone: true,
  imports: [CommonModule, QuizResultsListComponent, QuizListComponent],
  template: `
    <kepler-monorepo-quiz-list></kepler-monorepo-quiz-list>
    <kepler-monorepo-quiz-results-list></kepler-monorepo-quiz-results-list>
  `,
  styleUrls: ['./quiz-dashboard.component.scss']
})
export class QuizDashboardComponent {

}
