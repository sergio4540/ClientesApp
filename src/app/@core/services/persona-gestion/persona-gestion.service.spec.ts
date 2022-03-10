import { TestBed } from '@angular/core/testing';

import { PersonaGestionService } from './persona-gestion.service';

describe('PersonaGestionService', () => {
  let service: PersonaGestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonaGestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
