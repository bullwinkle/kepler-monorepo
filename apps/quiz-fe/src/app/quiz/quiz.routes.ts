import { QuizWizardComponent } from "./components/quiz-wizard/quiz-wizard.component";
import { QuizResultsComponent } from "./components/quiz-results/quiz-results.component";

export default [
  {
    path: "",
    pathMatch: "full",
    loadComponent: async () => QuizWizardComponent
  },
  {
    path: "results",
    loadComponent: async () => QuizResultsComponent
  }
];
