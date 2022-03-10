import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/@core/types/response.type';
import { getItem, removeItem, setItem, StorageItem } from '@app/@core/utils';
import { environment } from '@environments/environment';
import { NgxGenericRestService } from 'ngx-grs';
import { BehaviorSubject, Observable } from 'rxjs';
import { ForgotPassword } from '../models/forgot-password.model';
import { Login, LoginResponse } from '../models/login.model';
import { ResetPassword } from '../models/reset-password.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends NgxGenericRestService {
  isLoggedIn$ = new BehaviorSubject<boolean>(!!getItem(StorageItem.Auth));
  headers = new HttpHeaders();
  endpoint = environment.api.general;

  constructor() {
    super({
      baseUrl: environment.api.general,
      resourceName: 'Users',
    });

    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
  }

  get isLoggedIn(): boolean {
    return this.isLoggedIn$.getValue();
  }

  getUserById(userId: string): Observable<any> {
    return this.single<ApiResponse<User>>('', {
      urlRewrite: `${this.endpoint}/Users/GetUsersById/${userId}`,
      mapFn: (res) => res.result,
    });
  }

  signIn(login: Login): Observable<ApiResponse<LoginResponse>> {
    return this.add<ApiResponse<LoginResponse>>(login as any, {
      urlPostfix: 'Login',
      headers: this.headers,
    });
  }

  signUp(user: User): Observable<ApiResponse<User>> {
    return this.add(user as any, {
      urlPostfix: 'Register',
      headers: this.headers,
    });
  }

  forgotPassword(
    forgotPassword: ForgotPassword,
  ): Observable<ApiResponse<ForgotPassword>> {
    return this.add<ApiResponse<ForgotPassword>>(forgotPassword as any, {
      urlPostfix: 'ForgotPassword',
      headers: this.headers,
      mapFn: (res) => res.result,
    });
  }

  resetPassword(
    resetPassword: ResetPassword,
  ): Observable<ApiResponse<ResetPassword>> {
    return this.add<ApiResponse<ResetPassword>>(resetPassword as any, {
      urlPostfix: 'ResetPassword',
      headers: this.headers,
      mapFn: (res) => res.result,
    });
  }

  updateUser(user: User): Observable<ApiResponse<User>> {
    return this.update<ApiResponse<User>>('', user as any, {
      headers: this.headers,
    });
  }

  // resetPasswordNoToken(
  //   resetPasswordNoToken: ResetPasswordNoToken,
  // ): Observable<any> {
  //   return this.http.post(
  //     `${this.endpoint}Account/ResetPasswordNoToken`,
  //     resetPasswordNoToken,
  //     {
  //       headers: this.headers,
  //     },
  //   );
  // }

  signOut(): void {
    removeItem(StorageItem.Auth);
    removeItem(StorageItem.Persona);
    removeItem(StorageItem.Encabezado);
    this.isLoggedIn$.next(false);
  }

  saveToken(token: string): void {
    setItem(StorageItem.Auth, token);
    this.isLoggedIn$.next(true);
  }
}
