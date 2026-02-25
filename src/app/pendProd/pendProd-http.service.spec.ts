import { TestBed } from '@angular/core/testing';

import { PendProdHttpService } from './pendProd-http.service';

describe('PendProdHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PendProdHttpService = TestBed.get(PendProdHttpService);
    expect(service).toBeTruthy();
  });
});
