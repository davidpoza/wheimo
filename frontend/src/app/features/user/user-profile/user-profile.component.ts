import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '@core/services/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, PasswordModule, ToastModule, TranslocoModule],
  providers: [MessageService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  changePasswordVisible = signal(false);
  saving = signal(false);

  form = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  get canSave() {
    return this.form.valid && !this.saving();
  }

  get passwordsMismatch() {
    return this.form.errors?.['passwordsMismatch'] && this.form.get('confirmPassword')?.dirty;
  }

  logout() {
    this.authService.logout().subscribe();
  }

  openChangePassword() {
    this.form.reset();
    this.changePasswordVisible.set(true);
  }

  closeChangePassword() {
    this.form.reset();
    this.changePasswordVisible.set(false);
  }

  savePassword() {
    if (!this.canSave) return;
    const { currentPassword, newPassword } = this.form.value;
    this.saving.set(true);
    this.authService.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('user.profile.toast.updated'), life: 3000 });
        this.closeChangePassword();
        this.saving.set(false);
      },
      error: (err) => {
        const msg = err.error?.error ?? this.transloco.translate('user.profile.toast.error');
        this.messageService.add({ severity: 'error', summary: this.transloco.translate('common.error'), detail: msg, life: 5000 });
        this.saving.set(false);
      },
    });
  }
}
