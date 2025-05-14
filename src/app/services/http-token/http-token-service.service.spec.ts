import { TestBed } from '@angular/core/testing';

import { HttpTokenServiceService } from './http-token-service.service';

describe('HttpTokenServiceService', () => {
  let service: HttpTokenServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpTokenServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
