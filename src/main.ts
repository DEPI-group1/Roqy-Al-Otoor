import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { RegisterComponent } from './app/components/register/register.component';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import 'bootstrap/dist/js/bootstrap.bundle';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // توفير التوجيه (Router)
    provideHttpClient(), // توفير HTTP Client
    provideAnimations(), // توفير الرسوم المتحركة
    importProvidersFrom(MatSnackBarModule), // استيراد MatSnackBarModule من Angular Material
    RegisterComponent, // تسجيل RegisterComponent
  ],
}).catch((err) => console.error(err));
