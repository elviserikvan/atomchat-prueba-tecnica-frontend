import { AuthService } from '@/app/core/services/auth/auth.service';
import { FirebaseAuthService } from '@/app/core/services/firebase-auth/firebase-auth.service';
import { SessionService } from '@/app/core/services/session/session.service';
import { Component, type OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isSubmitting = false;
  isFirebaseSubmitting = false;
  errorMessage = '';

  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const hasValidSession = await this.sessionService.hasValidSession();

    if (hasValidSession) {
      await this.router.navigate(['/tasks']);
    }
  }

  async submit(): Promise<void> {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const email = this.loginForm.getRawValue().email!.trim().toLowerCase();

    try {
      const result = await this.authService.login(email);

      if (!result.user && !result.exists) {
        const shouldCreate = window.confirm(
          'Este usuario no existe todavía. ¿Deseas crearlo y continuar?',
        );

        if (!shouldCreate) {
          this.isSubmitting = false;
          return;
        }

        const createdResult = await this.authService.login(email, true);
        await this.sessionService.setSession({
          email: createdResult.user!.email,
          accessToken: createdResult.accessToken!,
          expiresAt: createdResult.expiresAt!,
        });
        await this.router.navigate(['/tasks']);
        return;
      }

      await this.sessionService.setSession({
        email: result.user!.email,
        accessToken: result.accessToken!,
        expiresAt: result.expiresAt!,
      });
      await this.router.navigate(['/tasks']);
    } catch (error) {
      console.error(error);
      this.errorMessage =
        'No fue posible iniciar sesión. Verifica el correo e inténtalo de nuevo.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    if (this.isFirebaseSubmitting) {
      return;
    }

    this.isFirebaseSubmitting = true;
    this.errorMessage = '';

    try {
      const firebaseIdToken = await this.firebaseAuthService.signInWithGoogle();
      const result = await this.authService.firebaseLogin(firebaseIdToken);

      await this.sessionService.setSession({
        email: result.user!.email,
        accessToken: result.accessToken!,
        expiresAt: result.expiresAt!,
      });

      await this.router.navigate(['/tasks']);
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No fue posible iniciar sesión con Google/Firebase.';
    } finally {
      this.isFirebaseSubmitting = false;
    }
  }
}
