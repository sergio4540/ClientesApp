import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { NgxGenericRestService } from 'ngx-grs';

@Injectable({
  providedIn: 'root',
})
export class PersonaGestionService extends NgxGenericRestService {
  constructor() {
    super({
      baseUrl: environment.api.general,
      resourceName: 'GrExPersonaGestion',
    });
  }
}
