import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kepler-monorepo-quiz-configuration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      quiz-configuration works!
    </p>
  `,
  styleUrls: ['./quiz-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizConfigurationComponent {

}
