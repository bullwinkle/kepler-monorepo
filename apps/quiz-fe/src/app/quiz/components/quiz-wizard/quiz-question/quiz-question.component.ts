import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, FormBuilder, FormRecord, ReactiveFormsModule } from "@angular/forms";
import { ControlType, Question } from "@kepler-monorepo/data";
import { provideControlValueAccessor } from "../../../utils";

@Component({
  selector: "kepler-monorepo-quiz-question",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    provideControlValueAccessor(() => QuizQuestionComponent)
  ],
  template: `
    <!-- Using *ngIf instead of [ngSwitch] because of type checking bug in [ngSwitch] (https://spin.atomicobject.com/2021/12/01/ngswitch-type-errors/) -->
    <ng-container *ngIf="question" [formGroup]="questionFormRecord">
      <div *ngIf="question.controlType === controlType.INPUT">
        <label>{{ question.label }}</label>
        <input [formControlName]="'answer'" [value]="questionFormRecord.get('answer')?.value" name="answer" type="text">
      </div>

      <div *ngIf="question.controlType === controlType.NUMERIC">
        <label>{{ question.label }}</label>
        <input [formControlName]="'answer'" [value]="questionFormRecord.get('answer')?.value" name="answer"
               type="number">
      </div>

      <div *ngIf="question.controlType === controlType.SINGLE && question.options as options">
        <label>{{ question.label }}</label>
        <div *ngFor="let option of options">
          <label>
            <input [formControlName]="'answer'" name="answer" type="radio" [value]="option">
            {{ option }}
          </label>
        </div>
      </div>

      <div *ngIf="question.controlType === controlType.MULTI && question.options as options" [formArrayName]="'answer'">
        <label>{{ question.label }}</label>
        <div *ngFor="let option of options; let optionIndex = index">
          <label>
            <input [formControlName]="optionIndex" name="answer" type="checkbox" [value]="option">
            {{ option }}
          </label>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ["./quiz-question.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizQuestionComponent implements ControlValueAccessor, OnInit {
  @Input() question!: Question;

  readonly controlType = { ...ControlType };

  private isDisabled = false;

  questionFormRecord: FormRecord = this.formBuilder.record({
    answer: ""
  }, { updateOn: "change" });

  onChange: (v: any) => void = (v) => console.warn("onChange not implemented", v);
  onTouched: () => void = () => console.warn("onTouched not implemented");

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.question?.controlType === ControlType.MULTI) {
      this.questionFormRecord.setControl("answer", this.formBuilder.array([
        ...(this.question.options ?? []).map(() => this.formBuilder.control(false))
      ]));
    }

    this.questionFormRecord.valueChanges.subscribe(({ answer }) => {
      console.warn("this.questionFormRecord.valueChanges -> onChange", { answer });
      if (this.question?.controlType === ControlType.MULTI) {
        const options = this.question.options ?? [];
        const resultAnswer = (answer as Array<boolean | string | null>)
          .map((value, i) => value ? options[i] : null)
          .filter(Boolean);
        this.onChange({questionId: this.question._id, answer: `${resultAnswer}` });
      } else {
        this.onChange({questionId: this.question._id, answer });
      }
      this.onTouched();
    });
  }

  registerOnChange(fn: any): void {
    console.warn("registerOnChange", fn);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.warn("registerOnTouched", fn);
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.warn("setDisabledState", isDisabled);
    this.isDisabled = isDisabled;
  }

  writeValue({answer, _id}: {_id: string; answer: string}): void {
    console.warn("writeValue", this.question);
    if (this.question?.controlType === ControlType.MULTI) {
      const selectedOptions = answer.split(',');
      this.questionFormRecord.patchValue({
        questionId: _id, answer: (this.question?.options ?? []).map(option => selectedOptions.includes(option))
      });
    } else {
      this.questionFormRecord.patchValue({
        questionId: _id, answer
      });
    }
  }
}
