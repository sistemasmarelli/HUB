import { TestBed } from '@angular/core/testing';

import { AuthHttpService } from './auth-http.service';

describe('AuthHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthHttpService = TestBed.get(AuthHttpService);
    expect(service).toBeTruthy();
  });
});
