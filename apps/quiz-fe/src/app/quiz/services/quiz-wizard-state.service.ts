import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, map, Observable, of, shareReplay, tap } from "rxjs";
import { FormArray, FormBuilder } from "@angular/forms";
import { Quiz, Step } from "../interfaces";
import { QuizApiService } from "./quiz-api.service";
import { clampValue } from "../utils";

export interface State {
  currentStep: number;
  quiz?: Quiz;
  loaded: boolean;
}

export const initialState: State = {
  quiz: undefined,
  currentStep: 0, // index,
  loaded: false
};

@Injectable({
  providedIn: "root"
})
export class QuizWizardStateFacade {
  readonly #stateSubject$: BehaviorSubject<State> = new BehaviorSubject<State>({ ...initialState });

  public readonly state$: Observable<State> = this.#stateSubject$.asObservable().pipe(shareReplay({
    refCount: true,
    bufferSize: 1
  }));

  public get state(): State {
    return this.#stateSubject$.getValue();
  }

  public get steps(): ReadonlyArray<Step> {
    return this.state?.quiz?.steps ?? [];
  }

  public readonly loaded$ = this.state$.pipe(map(it => it?.loaded));
  public readonly currentStep$ = this.state$.pipe(map(it => it?.currentStep ?? 0));
  public readonly quiz$ = this.state$.pipe(
    map(it => it?.quiz ?? null),
    distinctUntilChanged(),
    tap((quiz) => {
      const steps = quiz?.steps ?? [];
      console.warn("HI!", steps);
      this.stepsFormArray.clear();
      for (const step of steps) this.stepsFormArray.push(this.formBuilder.group({
        id: step.id,
        questions: this.formBuilder.array(step.questions.map(({ id }) => ({ id, answer: "" })))
      }));
    }),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  public quizFormRecord = this.formBuilder.record({
    steps: this.formBuilder.array([])
  }, { updateOn: "change" });

  get stepsFormArray() {
    return this.quizFormRecord.get("steps") as FormArray;
  }

  constructor(private quizService: QuizApiService, private formBuilder: FormBuilder) {
    console.warn("constructor!!!");
    this.quiz$.subscribe();
  }


  // Generic update
  public patchState(patch: Partial<State>): State {
    const newState = {
      ...this.state,
      ...patch
    };

    this.#stateSubject$.next(newState);

    return newState;
  }

  // Commands
  public fetchQuiz(): Observable<Quiz> {
    if (this.state.loaded && this.state.quiz) return of(this.state.quiz);

    return this.quizService.getQuiz()
      .pipe(
        tap((quiz) => {
          this.patchState({ quiz, loaded: true });
          this.setStep(this.state.currentStep);

          // this.quizFormRecord.reset({})
        })
      );
  }

  public setStep(step: number) {
    this.patchState({
      currentStep: clampValue(step, 0, this.steps.length - 1)
    });
  }

  public nextStep() {
    this.setStep(this.state.currentStep + 1);
  }

  public previousStep() {
    this.setStep(this.state.currentStep - 1);
  }
}
