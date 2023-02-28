import type { ControlType } from "../constants";

export interface Quiz {
  id: string;
  steps: Step[];
}

interface GenericQuestion<T extends ControlType> {
  id: string;
  label: string;
  type: T;
}

export type SimpleQuestion = GenericQuestion<ControlType.INPUT | ControlType.NUMERIC>;

export  interface QuestionWithOptions extends GenericQuestion<ControlType.SINGLE | ControlType.MULTI> {
  options: string[];
}

export type Question = SimpleQuestion | QuestionWithOptions;


export interface Step {
  id: string;
  title: string;
  questions: Question[];
}
