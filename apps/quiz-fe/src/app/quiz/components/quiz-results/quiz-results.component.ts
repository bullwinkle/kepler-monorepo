import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kepler-monorepo-quiz-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      Congratulations! You've passed the quiz!
    </p>
  `,
  styleUrls: ['./quiz-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizResultsComponent {

}
