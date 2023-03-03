import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, shareReplay, tap } from "rxjs";
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { Quiz, Step } from "@kepler-monorepo/data";
import { QuizApiService } from "./quiz-api.service";
import { clampValue } from "../utils";

interface Nested {
  _id: FormControl<string>;
  questions: FormArray<FormControl<{ _id: string; answer: string; label: string; }>>;
}

type Result = FormGroup<Nested>;

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
      for (const step of steps) this.stepsFormArray.push(this.formBuilder.group<Nested>({
        _id: this.formBuilder.control(step._id),
        questions: this.formBuilder.array(step.questions.map(({ _id, label }) => ({ _id, label, answer: "" })))
      }));
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  stepsFormArray = this.formBuilder.array<Result>([]);
  public quizFormRecord = this.formBuilder.record({
    steps: this.stepsFormArray
  }, { updateOn: "change" });

  // get stepsFormArray() {
  //   return this.quizFormRecord.get("steps") as FormArray;
  // }

  constructor(private quizService: QuizApiService, private formBuilder: NonNullableFormBuilder) {
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
  public fetchQuiz(): Observable<Quiz | null> {
    if (this.state.loaded && this.state.quiz) return of(this.state.quiz);

    return this.quizService.getApiQuiz()
      .pipe(
        tap((quiz) => {
          console.warn("fetch quiz success", quiz);
          this.patchState({ quiz, loaded: true });
          this.setStep(this.state.currentStep);

          // this.quizFormRecord.reset({})
        }),
        catchError((err) => {
          console.warn("fetch quiz error", err);
          return of(null);
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
