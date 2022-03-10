import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FooterModule } from '@app/@shell/ui/footer/footer.module';
import { DxButtonModule, DxFormModule, DxLoadPanelModule, DxPopupModule } from 'devextreme-angular';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { PasswordResetFailedPage } from './pages/password-reset-failed/password-reset-failed.page';
import { PasswordResetSucceededPage } from './pages/password-reset-succeeded/password-reset-succeeded.page';
import { PasswordResetPage } from './pages/password-reset/password-reset.page';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';
import { TypePersonPage } from './pages/type-person/type-person.page';

@NgModule({
  declarations: [
    SignInPage,
    SignUpPage,
    ForgotPasswordPage,
    PasswordResetPage,
    PasswordResetSucceededPage,
    PasswordResetFailedPage,
    TypePersonPage,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    DxFormModule,
    DxButtonModule,
    DxPopupModule,
    DxLoadPanelModule,
    FooterModule,],
})
export class AuthModule {}
