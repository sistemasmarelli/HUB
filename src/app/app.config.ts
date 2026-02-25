import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PoHttpInterceptorModule, PoHttpRequestModule } from '@po-ui/ng-components';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),   
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom([PoHttpRequestModule, PoHttpInterceptorModule ]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideAnimations()
  ],  
};