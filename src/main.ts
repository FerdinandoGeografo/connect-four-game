import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { MAT_BUTTON_CONFIG } from '@angular/material/button';

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withXhr()),
    {
      provide: MAT_BUTTON_CONFIG,
      useValue: {
        disableRipple: false,
      },
    },
  ],
}).catch((err) => console.error(err));
