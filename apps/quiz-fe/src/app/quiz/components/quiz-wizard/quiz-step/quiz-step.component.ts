import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Step } from "../../../interfaces";
import { QuizQuestionComponent } from "../quiz-question/quiz-question.component";

@Component({
  selector: 'kepler-monorepo-quiz-step',
  standalone: true,
  imports: [CommonModule, QuizQuestionComponent],
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./quiz-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizStepComponent {
  @Input() step!: Step;
  @Input() isFirstStep?: boolean;
  @Input() isLastStep?: boolean;
  @Output() stepValuesSubmitted = new EventEmitter<any>();

  questionValues: any = {};

  onSubmit(): void {
    this.stepValuesSubmitted.emit(this.questionValues);
  }
}
