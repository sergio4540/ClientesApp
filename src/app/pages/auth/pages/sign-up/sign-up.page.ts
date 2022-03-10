import { HttpParams } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { TipoPersona } from '@app/@core/enums/tipo-persona.type';
import { PersonaGestion } from '@app/@core/models/persona-gestion.model';
import { TipoDatos } from '@app/@core/models/tipo-datos.model';
import { AlertService } from '@app/@core/services/alert/alert.service';
import { PersonaGestionService } from '@app/@core/services/persona-gestion/persona-gestion.service';
import { TipoDatosService } from '@app/@core/services/tipo-datos/tipo-datos.service';
import { custom } from 'devextreme/ui/dialog';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  @Input() visible!: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  register: Partial<{
    user: User;
    persona: PersonaGestion;
  }> = {};

  tiposPersona: TipoDatos[] = [];
  tiposDocumento: TipoDatos[] = [];

  passwordMode = 'password';
  passwordHint = 'Mostrar contraseña';
  passwordIcon = 'fal fa-eye';
  passwordConfirmMode = 'password';
  passwordConfirmHint = 'Mostrar contraseña';
  passwordConfirmIcon = 'fal fa-eye';

  error = '';
  loadingVisible = false;
  ayudaVisible = false;
  maxLengthTipoPersona = 20;

  pattern = '^[0-9a-zA-Z\\s]+$';

  get tipoPersona(): TipoPersona {
    const { idTipoPersona } = this.register.persona || {};
    return [1, 3].includes(idTipoPersona || 0)
      ? TipoPersona.Natural
      : TipoPersona.Juridica;
  }
  get tipoPersonaNacional(): TipoPersona {
    const { idTipoPersona } = this.register.persona || {};
    return [1, 2].includes(idTipoPersona || 0)
      ? TipoPersona.Nacional
      : TipoPersona.Internacional;
  }

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private tipoDatosService: TipoDatosService,
    private personaGestionService: PersonaGestionService,
    private alertService: AlertService,
  ) {
    this.passwordComparison = this.passwordComparison.bind(this);
    this.onValueChangedTipoPersona = this.onValueChangedTipoPersona.bind(this);
    this.onValueChangedTipoDocumento =
      this.onValueChangedTipoDocumento.bind(this);
  }
  ngOnInit(): void {
    this.consultarTipos('TipoPersona').subscribe(
      (tipos) => (this.tiposPersona = tipos),
    );
  }

  consultarTipos(tipo: string): Observable<TipoDatos[]> {
    const params = new HttpParams()
      .append('filter', `Tipo=${tipo}`)
      .append('filter', `Activo=${true}`);
    return this.tipoDatosService.list<TipoDatos[]>({
      urlPostfix: 'GetListByAdvanceQuery',
      params,
      mapFn: ({ result }) => result,
    });
  }

  grabarPersona(persona: PersonaGestion): Observable<PersonaGestion> {
    return this.personaGestionService.add<PersonaGestion>(persona, {
      mapFn: (res) => res.result,
    });
  }

  passwordComparison() {
    return this.register?.user?.password;
  }

  onHiding() {
    this.visibleChange.emit(false);
  }

  onValueChangedTipoPersona(e: any): void {
    if (e.value) {
      if (this.register.persona) {
        this.register.persona.idTipoPersona = e.value;
        if (this.tipoPersona === 'NATURAL') {
          if (this.tipoPersonaNacional === 'NACIONAL') {
            this.consultarTipos('TipoDocumento').subscribe((tipos) => {
              this.tiposDocumento = tipos.filter(
                (x) => x.idTipo === 5 || x.idTipo === 9,
              );
            });
          } else {
            this.consultarTipos('TipoDocumento').subscribe((tipos) => {
              this.tiposDocumento = tipos.filter(
                (x) => x.idTipo === 6 || x.idTipo === 7,
              );
            });
          }
        }
        if (this.tipoPersona === 'JURIDICA') {
          if (this.tipoPersonaNacional === 'NACIONAL') {
            this.consultarTipos('TipoDocumento').subscribe((tipos) => {
              this.tiposDocumento = tipos.filter((x) => x.idTipo === 8);
            });
          } else {
            this.consultarTipos('TipoDocumento').subscribe((tipos) => {
              this.tiposDocumento = tipos.filter((x) => x.idTipo === 10);
            });
          }
        }
      }
    }
  }
  onValueChangedTipoDocumento(e: any): void {
    if (e.value) {
      if (this.register.persona) {
        this.register.persona.idTipoDocumento = e.value;
        if (e.value == 8) {
          this.maxLengthTipoPersona = 9;
          this.pattern = '^[0-9]+$';
        } else if (e.value == 9 || e.value == 5) {
          this.pattern = '^[0-9]+$';
        } else {
          this.maxLengthTipoPersona = 20;
          this.pattern = '^[0-9a-zA-Z\\S]+$';
        }
      }
    }
  }

  onSubmit(event: any): void {
    event.preventDefault();

    this.loadingVisible = true;

    const { user, persona } = this.register;

    if (!user || !persona) return;

    this.authService
      .signUp(user)
      .pipe(
        switchMap(({ isSuccess, result: usuarioRegistrado, message }) => {
          if (!isSuccess) {
            this.alertService.showError(message);
            return of(null);
          }

          if (usuarioRegistrado) {
            const nuevaPersona = this.mapearPersona(usuarioRegistrado);
            return this.grabarPersona({ ...persona, ...nuevaPersona });
          }

          return of(null);
        }),
        finalize(() => (this.loadingVisible = false)),
      )
      .subscribe((persona) => {
        if (persona) {
          this.visible = false;
          this.register.user = {};
          this.register.persona = {};

          this.activacionCuentaMensaje();
          this.alertService.showSuccess(
            'Registro realizado correctamente - Registration successful',
          );
        }
      });
  }

  private mapearPersona(usuario: User): PersonaGestion {
    const persona: PersonaGestion = {
      idUser: usuario.idUser,
      email: usuario.userName,
    };

    if (this.tipoPersona === 'NATURAL') {
      persona.nombres = usuario.firstName?.toUpperCase();
      persona.apellidos = usuario.lastName?.toUpperCase();
    } else {
      persona.razonSocial = usuario.firstName?.toUpperCase();
    }

    return persona;
  }

  onClickAyuda(e: any) {
    this.ayudaVisible = true;
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
}
