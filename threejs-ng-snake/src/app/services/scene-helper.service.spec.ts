import { TestBed } from '@angular/core/testing';

import { SceneHelperService } from './scene-helper.service';

describe('SceneHelperService', () => {
  let service: SceneHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SceneHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
