import { Route } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { HomeComponent } from "./home/home.component";

export default [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent
  },
  {
    path: "quiz",
    loadChildren: () => import("./quiz/quiz.routes")
  },
  {
    path: "admin",
    loadChildren: () => import("./quiz/quiz-admin.routes")
  },
  {
    path: "**",
    component: NotFoundComponent
  }
] as Route[];
