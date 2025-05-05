import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {

  
  providers: [provideRouter(routes), provideClientHydration(),importProvidersFrom(FormsModule), provideHttpClient(withFetch()),]
};
