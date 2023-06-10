import { TestBed } from '@angular/core/testing';

import { UserActivoService } from './user-activo.service';

describe('UserActivoService', () => {
  let service: UserActivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
