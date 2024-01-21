import { HttpClientModule } from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideProtractorTestingSupport} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideProtractorTestingSupport(),
    importProvidersFrom(HttpClientModule),
  ]
};
