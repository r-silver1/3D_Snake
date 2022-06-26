import { TestBed } from '@angular/core/testing';

import { ScoreboardHelperService } from './scoreboard-helper.service';

describe('ScoreboardHelperService', () => {
  let service: ScoreboardHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreboardHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
