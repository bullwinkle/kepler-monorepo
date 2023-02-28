export interface Quiz {
  _id: string;
  steps: Step[];
}

export interface Question {
  _id: string;
  label: string;
  options?: string[];
  controlType: string;
}


export interface Step {
  _id: string;
  title: string;
  questions: Question[];
}

export interface QuizResultQuestion {
  _id?: string;
  label: string;
  answer: string;
}

export interface QuizResultStep {
  _id?: string;
  questions: QuizResultQuestion[];
}

export interface QuizResult {
  _id?: string;
  steps: QuizResultStep[];
}
