import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import localEs from '@angular/common/locales/es-CO';
import localFr from '@angular/common/locales/fr';
import localJa from '@angular/common/locales/ja';
import { registerLocaleData } from '@angular/common';
import { LocaleService } from './services/locale.service';

registerLocaleData(localEs, 'es-CO');
registerLocaleData(localFr, 'fr');
registerLocaleData(localJa, 'ja');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: LOCALE_ID,
      deps: [LocaleService],
      useFactory: (localeService: LocaleService) => localeService.getLocale
    }
  ]
};
