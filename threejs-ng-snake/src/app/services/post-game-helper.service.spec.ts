import { TestBed } from '@angular/core/testing';

import { PostGameHelperService } from './post-game-helper.service';

describe('PostGameHelperService', () => {
  let service: PostGameHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostGameHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
