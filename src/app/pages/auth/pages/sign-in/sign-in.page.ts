import { HttpParams } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoPersona } from '@app/@core/enums/tipo-persona.type';
import { PersonaGestion } from '@app/@core/models/persona-gestion.model';
import { AlertService } from '@app/@core/services/alert/alert.service';
import { PersonaGestionService } from '@app/@core/services/persona-gestion/persona-gestion.service';
import { setItem, StorageItem } from '@app/@core/utils';
import { ROUTER_UTILS } from '@app/@core/utils/router.utils';
import { DxFormComponent } from 'devextreme-angular';
import { custom } from 'devextreme/ui/dialog';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Login } from '../../models/login.model';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  login: Login;

  @ViewChild('formLogin')
  formLogin!: DxFormComponent;

  // Objeto de cargas y alerta
  // loader: LoaderComponent = new LoaderComponent();
  // toast: ToastComponent = new ToastComponent();

  popupForgotPasswordVisible = false;
  popupResetPasswordVisible = false;
  popupRegisterVisible = false;
  aceptacionEspanol!: string;
  aceptacionIngles!: string;
  returnUrl: string | null;
  error!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private personaGestionService: PersonaGestionService,
    private alertService: AlertService,
  ) {
    this.returnUrl =
      this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
    this.onEnterKeyPassword = this.onEnterKeyPassword.bind(this);
    this.login = {};
    this.aceptacionEspanol =
      'La Universidad CES ha dispuesto el presente formulario para quienes deseen vincularse con ella. La información que usted suministre es muy importante para nosotros, por lo que agradecemos el diligenciamiento de todos campos requeridos, de no hacerse se tomará como incompleto y no se continuará con el proceso.';
    this.aceptacionIngles =
      'CES UNIVERSITY form for suppliers. The information you provide is very important for us, please fill out all required fields. In case all are not filled,  the  request will be considered as incomplete and will not be continued. ';
  }

  //#region Servicios de consulta
  consultarPersona(idUser: string): Observable<PersonaGestion> {
    const params = new HttpParams().append('filter', `IdUser=${idUser}`);
    return this.personaGestionService.single<PersonaGestion>(
      'GetOneByAdvanceQuery',
      {
        params,
        mapFn: ({ result }) => result,
      },
    );
  }
  //#endregion

  onEnterKeyPassword(e: any): void {
    this.signIn();
  }

  onClickSignIn(): void {
    this.signIn();
  }

  onClickForgotPassword(): void {
    this.popupForgotPasswordVisible = true;
  }

  onClickRegister(): void {
    this.popupRegisterVisible = true;
  }

  signIn(): void {
    if (!this.formLogin.instance.validate().isValid) {
      this.alertService.showInfo(
        'Missing data to fill out - Faltan datos por diligenciar',
      );
      return;
    }

    this.authService
      .signIn(this.login)
      .pipe(
        switchMap(({ isSuccess, result: loginResponse, message }) => {
          if (!isSuccess) {
            this.alertService.showError(message);
            return of(null);
          }
          const { idUser, emailConfirmed } = loginResponse?.user || {};

          if (emailConfirmed !== true) {
            this.activacionCuentaMensaje();
            return of(null);
          }

          if (idUser) {
            return forkJoin({
              persona: this.consultarPersona(idUser),
              token: of(loginResponse.token),
            });
          }

          return of(null);
        }),
      )
      .subscribe(async (result) => {
        const { persona, token } = result || {};

        if (persona?.idTipoPersona && token) {
          setItem(StorageItem.Persona, persona);
          const tipoPersona = this.obtenerTipoPersona(persona.idTipoPersona);
          await new Promise((f) => setTimeout(f, 1000));
          this.authService.saveToken(token);
          this.navegar(tipoPersona);
        }
      });
  }

  private navegar(tipoPersona: TipoPersona) {
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    } else if (tipoPersona === TipoPersona.Nacional) {
      this.router.navigate([
        '/',
        ROUTER_UTILS.config.gestionRiesgo.root,
        ROUTER_UTILS.config.gestionRiesgo.nacional,
        ROUTER_UTILS.config.gestionRiesgo.dashboardNacional,
      ]);
    } else {
      this.router.navigate([
        '/',
        ROUTER_UTILS.config.gestionRiesgo.root,
        ROUTER_UTILS.config.gestionRiesgo.internacional,
        ROUTER_UTILS.config.gestionRiesgo.dashboardNacional,
      ]);
    }
  }

  activacionCuentaMensaje(): void {
    const message = `Hemos enviado al correo electrónico un link para verificar el proceso de registro y pueda iniciar sesión. Si no encuentras el correo en la bandeja de entrada, recomendamos revisar en correos no deseados.

    Log in in the link we sent you in an email to verify the registration process.  If you can't find the email in your inbox, we recommend you to check the spam box.`;
    const confirmDialog = custom({
      title: 'Activación de cuenta - Account activation',
      message,
      buttons: [
        {
          text: 'Aceptar / To accept',
          type: 'success',
          onClick: (e) => {
            return { buttonText: e.component.option('text') };
          },
        },
      ],
    });
    confirmDialog.show().then((dialogResult: any) => {
      const state = window.history.state;
    });
  }

  private obtenerTipoPersona(idTipoPersona: number): TipoPersona {
    return [1, 2].includes(idTipoPersona || 0)
      ? TipoPersona.Nacional
      : TipoPersona.Internacional;
  }
}
