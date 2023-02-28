import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "quiz",
    loadComponent: async () => (await import("./quiz/components/quiz-wizard/quiz-wizard.component")).QuizWizardComponent
  },
  {
    path: "configuration",
    loadComponent: async () => (await import("./quiz/components/quiz-configuration/quiz-configuration.component")).QuizConfigurationComponent
  }
];
