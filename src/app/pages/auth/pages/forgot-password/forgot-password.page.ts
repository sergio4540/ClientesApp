import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AlertService } from '@app/@core/services/alert/alert.service';
import { ForgotPassword } from '../../models/forgot-password.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {
  @Input() visible!: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  forgotPassword!: ForgotPassword;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
  ) {}

  onHiding() {
    this.visibleChange.emit(false);
  }

  onSubmit(event: any): void {
    event.preventDefault();

    this.authService
      .forgotPassword(this.forgotPassword)
      .subscribe(({ isSuccess, message }) => {
        if (isSuccess) {
          this.visible = false;
          this.alertService.showSuccess(
            `Hemos enviado instrucciones para restablecer su contraseña al correo: ${this.forgotPassword.email}`,
          );
        } else {
          console.log('failure', message);
        }
        this.cdr.markForCheck();
      });
  }
}
