import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { MAT_BUTTON_CONFIG } from '@angular/material/button';

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Progressive enhancement: browsers without the View Transitions API just swap routes.
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
    provideHttpClient(withXhr()),
    {
      provide: MAT_BUTTON_CONFIG,
      useValue: {
        disableRipple: false,
      },
    },
  ],
}).catch((err) => console.error(err));
