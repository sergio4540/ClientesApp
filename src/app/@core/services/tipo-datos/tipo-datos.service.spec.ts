import { TestBed } from '@angular/core/testing';

import { TipoDatosService } from './tipo-datos.service';

describe('TipoDatosService', () => {
  let service: TipoDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
