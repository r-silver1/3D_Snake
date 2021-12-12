import { TestBed } from '@angular/core/testing';

import { FontBuilderService } from './font-builder.service';

describe('FontBuilderService', () => {
  let service: FontBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
