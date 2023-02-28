import { ChangeDetectionStrategy, Component, HostListener, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { catchError, filter, map, of } from "rxjs";
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
    <form class="multi-step-wizard" [formGroup]="stateFacade.quizFormRecord" *ngIf="{
      currentStep: stateFacade.currentStep$ | async, 
      quiz: stateFacade.quiz$ | async, 
      loaded: stateFacade.loaded$ | async
    } as ctx">
      <div formArrayName="steps" [@slideAnimation]="ctx.currentStep" class="wizard-steps">
<!--      <div formArrayName="steps" class="wizard-steps">-->
        <div *ngIf="!ctx.loaded">Loading...</div>
        <!--        <ng-container *ngFor="let step of ctx.steps; let i = index" [formGroupName]="">-->
        <ng-container *ngFor="let step of ctx.quiz?.steps; let stepIndex = index" [formGroupName]="stepIndex">
          <kepler-monorepo-quiz-step formArrayName="questions" *ngIf="ctx.currentStep === stepIndex" class="wizard-step"
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

      <div class="wizard-navigation">
        <div>Current step: {{ (ctx.currentStep ?? 0) + 1 }}</div>
        <button
          type="button"
          class="previous-button"
          (click)="goToPreviousStep()"
          [disabled]="!ctx.quiz?.steps?.length || ctx.currentStep === 0">
          Previous
        </button>

        <button
          type="button"
          class="next-button"
          (click)="goToNextStep()"
          [disabled]="!ctx.quiz?.steps?.length || ctx.currentStep === (ctx.quiz?.steps?.length ?? 0) - 1">
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
    
    <pre>{{ stateFacade.quizFormRecord.value | json }}</pre>
  `,
})
export class QuizWizardComponent implements OnInit {
  get currentStep() {
    return this.stateFacade.state.currentStep;
  }

  constructor(
    private quizService: QuizApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public stateFacade: QuizWizardStateFacade,
    // private quizSseService: QuizSseService
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
    this.stateFacade.nextStep();
  }

  onSubmit() {
    const formResult = {
      _id: this.stateFacade.state.quiz?._id,
      steps: this.stateFacade.stepsFormArray.value
    };
    this.quizService.saveQuiz(formResult).pipe(
      catchError((error: Error) => {
        console.warn("ERROR saving quiz", error);
        return of(null);
      })
    ).subscribe((response) => {
      console.warn("saving success", response);
    });
  }
}
