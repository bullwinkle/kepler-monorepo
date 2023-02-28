import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withEnabledBlockingInitialNavigation } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient } from "@angular/common/http";
import { enableProdMode } from "@angular/core";

import { AppComponent } from "./app/app.component";
import { appRoutes } from "./app/app.routes";

if (process.env['NODE_ENV'] === 'production') {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  ]
}).catch((err) => console.error("ERROR: bootstrapApplication", err));
