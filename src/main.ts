import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withViewTransitions } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
    provideHttpClient(withXhr()),
  ],
}).catch((err) => console.error(err));
