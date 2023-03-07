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
  templateUrl: 'quiz-wizard.template.html'
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
        console.log("saveQuiz: success", response);
        this.stateFacade.quizFormRecord.reset();
        this.router.navigateByUrl("quiz/results");
      },
      error: (error) => {
        console.warn("saveQuiz: error", error);
      }
    });
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.questionComponents.changes.pipe(startWith(this.questionComponents)),
      this.stateFacade.quizFormRecord.valueChanges.pipe(startWith(this.stateFacade.quizFormRecord.value))
    ]).pipe(
      map(([it]) => it.toArray().every((it2: any) => it2.questionFormRecord.valid)),
      delay(0, animationFrameScheduler)
    ).subscribe((isValid) => {
      this.isCurrentStepValid$.next(isValid);
    });
  }
}
