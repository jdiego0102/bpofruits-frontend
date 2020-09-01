import { TestBed } from '@angular/core/testing';

import { SidewalkService } from './sidewalk.service';

describe('SidewalkService', () => {
  let service: SidewalkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidewalkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
