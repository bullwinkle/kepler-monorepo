import { QuizDashboardComponent } from "./components/quiz-dashboard/quiz-dashboard.component";

export default [
  {
    path: "",
    loadComponent: async () => QuizDashboardComponent
  },
];
