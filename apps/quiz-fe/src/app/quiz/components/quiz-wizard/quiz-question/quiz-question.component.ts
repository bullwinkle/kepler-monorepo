import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, FormBuilder, FormRecord, ReactiveFormsModule } from "@angular/forms";
import { Question } from "../../../interfaces";
import { ControlType } from "../../../constants";
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
      <div *ngIf="question.type === controlType.INPUT">
        <label>{{ question.label }}</label>
        <input [formControlName]="'answer'" [value]="questionFormRecord.get('answer')?.value" name="answer" type="text">
      </div>

      <div *ngIf="question.type === controlType.NUMERIC">
        <label>{{ question.label }}</label>
        <input [formControlName]="'answer'" [value]="questionFormRecord.get('answer')?.value" name="answer" type="number">
      </div>

      <div *ngIf="question.type === controlType.SINGLE && question.options as options">
        <label>{{ question.label }}</label>
        <div *ngFor="let option of options">
          <label>
            <input [formControlName]="'answer'" name="answer" type="radio" [value]="option">
            {{ option }}
          </label>
        </div>
      </div>

      <div *ngIf="question.type === controlType.MULTI && question.options as options" [formArrayName]="'answer'">
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
    if (this.question.type === ControlType.MULTI) {
      this.questionFormRecord.setControl("answer", this.formBuilder.array([
        ...this.question.options.map(() => this.formBuilder.control(false))
      ]));
    }

    this.questionFormRecord.valueChanges.subscribe(({ answer }) => {
      console.warn("this.questionFormRecord.valueChanges -> onChange", { answer });
      if (this.question.type === ControlType.MULTI) {
        const options = this.question.options;
        const resultAnswer = (answer as Array<boolean | string | null>)
          .map((value, i) => value ? options[i] : null)
          .filter(Boolean);
        this.onChange({id: this.question.id, answer: `${resultAnswer}` });
      } else {
        this.onChange({id: this.question.id, answer });
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

  writeValue({answer, ...obj}: {id: string; answer: string}): void {
    console.warn("writeValue", obj, this.question);
    if (this.question.type === ControlType.MULTI) {
      const selectedOptions = answer.split(',');
      this.questionFormRecord.patchValue({
        ...obj, answer: this.question.options.map(option => selectedOptions.includes(option))
      });
    } else {
      this.questionFormRecord.patchValue({
        ...obj, answer
      });
    }
  }
}
