import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, FormBuilder, FormRecord, ReactiveFormsModule, Validators } from "@angular/forms";
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
        <input [formControlName]="'answer'" [value]="questionFormRecord.get('answer')?.value" type="text">
      </div>

      <div *ngIf="question.controlType === controlType.NUMERIC">
        <label>{{ question.label }}</label>
        <input [formControlName]="'answer'" [value]="questionFormRecord.get('answer')?.value"
               type="number">
      </div>

      <div *ngIf="question.controlType === controlType.SINGLE && question.options as options">
        <label>{{ question.label }}</label>
        <div *ngFor="let option of options">
          <label>
            <input [formControlName]="'answer'" type="radio" [value]="option">
            {{ option }}
          </label>
        </div>
      </div>

      <div *ngIf="question.controlType === controlType.MULTI && question.options as options" [formArrayName]="'answer'">
        <label>{{ question.label }}</label>
        <div *ngFor="let option of options; let optionIndex = index">
          <label>
            <input [formControlName]="optionIndex" type="checkbox" [value]="option">
            {{ option }}
          </label>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ["./quiz-question.component.scss"],
  exportAs:"quiz-question",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizQuestionComponent implements ControlValueAccessor, OnInit {
  @Input() question!: Question;

  readonly controlType = { ...ControlType };

  private isDisabled = false;

  questionFormRecord: FormRecord = this.formBuilder.record({
    label: this.formBuilder.control(''),
    answer: this.formBuilder.control('', {validators: Validators.required})
  }, { updateOn: "change" });

  onChange: (v: any) => void = (v) => console.warn("onChange not implemented", v);
  onTouched: () => void = () => console.warn("onTouched not implemented");

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.question?.controlType === ControlType.MULTI) {
      this.questionFormRecord.setControl("answer", this.formBuilder.array([
        ...(this.question.options ?? []).map(() => this.formBuilder.control(null))
      ], {validators: (control) => {
        return control.value.some(Boolean) ? null : {required: true};
        }}));
    }

    this.questionFormRecord.valueChanges.subscribe(({ answer }) => {
      const { controlType, options = [] as string[], label, _id } = this.question ?? {};
      if (controlType === ControlType.MULTI) {
        const resultAnswer = (answer as Array<boolean | string | null>)
          .map((value, i) => value ? options[i] : null)
          .filter(Boolean);
        this.onChange({_id, label, answer: `${resultAnswer}` });
      } else {
        this.onChange({_id, label, answer });
      }
      this.onTouched();
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue({answer, label, _id}: {_id: string; answer: string, label: string}): void {
    if (this.question?.controlType === ControlType.MULTI) {
      const selectedOptions = answer.split(',');
      this.questionFormRecord.patchValue({
        _id, label, answer: (this.question?.options ?? []).map(option => selectedOptions.includes(option))
      });
    } else {
      this.questionFormRecord.patchValue({
        _id, label, answer
      });
    }
  }

  labelToId (label: string): string {
    return label.replace(/\s/g, '')
  }
}
