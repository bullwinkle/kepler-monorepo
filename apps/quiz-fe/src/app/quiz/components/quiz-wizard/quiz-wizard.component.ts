import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { animationFrameScheduler, BehaviorSubject, combineLatest, delay, filter, map, startWith, take } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { QuizStepComponent } from "./quiz-step/quiz-step.component";
import { QuizQuestionComponent } from "./quiz-question/quiz-question.component";
import { QuizApiService } from "../../services/quiz-api.service";
import { slideAnimation } from "../../constants";
import { ActivatedRoute, Router } from "@angular/router";
import { index2number, number2Index } from "../../utils";
import { QuizWizardStateFacade } from "../../services/quiz-wizard-state.service";
import { QuizSseService } from "../../services/quiz-sse.service";

@Component({
  selector: "kepler-monorepo-quiz-wizard",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuizStepComponent, QuizQuestionComponent],
  providers: [QuizSseService],
  styleUrls: ["./quiz-wizard.component.scss"],
  animations: [slideAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="quiz-wizard flex-column" [formGroup]="stateFacade.quizFormRecord" *ngIf="{
      currentStep: stateFacade.currentStep$ | async, 
      quiz: stateFacade.quiz$ | async, 
      loaded: stateFacade.loaded$ | async
    } as ctx">
      <div *ngIf="!ctx.loaded">Loading...</div>
      <div formArrayName="steps" [@slideAnimation]="ctx.currentStep" class="flex-item-1 wizard-steps-container">
        <div class="wizard-steps overflow-1">
        <ng-container *ngFor="let step of ctx.quiz?.steps; let stepIndex = index" [formGroupName]="stepIndex">
          <kepler-monorepo-quiz-step
            formArrayName="questions"
            *ngIf="ctx.currentStep === stepIndex"
            class="wizard-step"
            [class.is-valid]="isCurrentStepValid$ | async"
            [step]="step">
            <h3>{{ step.title }}</h3>
            <kepler-monorepo-quiz-question
              *ngFor="let question of step.questions; let questionIndex = index"
              [formControlName]="questionIndex"
              [question]="question">
            </kepler-monorepo-quiz-question>
          </kepler-monorepo-quiz-step>
        </ng-container>
        </div>
      </div>

      <div class="flex-item-0 wizard-navigation flex-row flex-gap-lg">
        <button
          type="button"
          class="previous-button"
          (click)="goToPreviousStep()"
          [disabled]="!ctx.quiz?.steps?.length || ctx.currentStep === 0">
          Previous
        </button>
        
        <span class="step-counter">{{ (ctx.currentStep ?? 0) + 1 }}/{{ ctx.quiz?.steps?.length }}</span>

        <button
          type="button"
          class="next-button"
          (click)="goToNextStep()"
          [disabled]="(!ctx.quiz?.steps?.length || ctx.currentStep === (ctx.quiz?.steps?.length ?? 0) - 1) || (isCurrentStepValid$ | async) !== true">
          Next
        </button>

        <button
          type="submit"
          class="submit-button"
          *ngIf="ctx.currentStep === (ctx.quiz?.steps?.length ?? 0) - 1"
          (click)="onSubmit()">
          Submit
        </button>
      </div>
    </form>

<!--    <pre>{{ stateFacade.quizFormRecord.value | json }}</pre>-->
  `
})
export class QuizWizardComponent implements OnInit, AfterViewInit {
  @ViewChildren(QuizQuestionComponent) questionComponents!: QueryList<QuizQuestionComponent>;

  get currentStep() {
    return this.stateFacade.state.currentStep;
  }

  isCurrentStepValid$ = new BehaviorSubject(false);


  constructor(
    private quizService: QuizApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public stateFacade: QuizWizardStateFacade
  ) {
  }

  ngOnInit() {
    this.stateFacade.fetchQuiz().subscribe();

    this.stateFacade.currentStep$.pipe(
      map(index2number)
    ).subscribe((step) => this.router.navigate([], {
      queryParams: { step }
    }));

    this.activatedRoute.queryParams.pipe(
      map(({ step }) => number2Index(step)),
      filter((step) => step !== this.currentStep)
    ).subscribe((currentStep) => this.stateFacade.patchState({ currentStep }));
  }

  @HostListener("document:keydown.ArrowLeft", ["$event"])
  goToPreviousStep() {
    this.stateFacade.previousStep();
  }

  @HostListener("document:keydown.ArrowRight", ["$event"])
  goToNextStep() {
    this.isCurrentStepValid$.pipe(take(1)).subscribe((isStepValid) => {
      if (isStepValid) this.stateFacade.nextStep();
    })
  }

  onSubmit() {
    const formResult = {
      quizId: this.stateFacade.state.quiz?._id,
      steps: this.stateFacade.stepsFormArray.value.map((it) => ({
        ...it,
        _id: `${it._id}`,
        questions: (it.questions ?? []).map(it2 => ({ ...it2, questionId: it2._id }))
      }))
    };
    this.quizService.saveQuiz(formResult).subscribe({
      next: (response) => {
        console.log("saveQuiz: next", response);
        this.router.navigateByUrl("quiz/results");
      },
      error: (error) => {
        console.warn("saveQuiz: error", error);
      },
      complete: () => console.log("saveQuiz: complete")
    });
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.questionComponents.changes.pipe(startWith(this.questionComponents)),
      this.stateFacade.quizFormRecord.valueChanges.pipe(startWith(this.questionComponents, this.stateFacade.quizFormRecord.value))
    ]).pipe(
      map(([it]) => it.toArray().every((it2: any) => it2.questionFormRecord.valid)),
      delay(0, animationFrameScheduler)
    ).subscribe((isValid) => {
      this.isCurrentStepValid$.next(isValid);
    });
  }
}
