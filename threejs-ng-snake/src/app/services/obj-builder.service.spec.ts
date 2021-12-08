import { TestBed } from '@angular/core/testing';

import { ObjBuilderService } from './obj-builder.service';

describe('ObjBuilderService', () => {
  let service: ObjBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
