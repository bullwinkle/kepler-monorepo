import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withEnabledBlockingInitialNavigation } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient } from "@angular/common/http";

import { AppComponent } from "./app/app.component";
import { appRoutes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  ]
}).catch((err) => console.error("ERROR: bootstrapApplication", err));
