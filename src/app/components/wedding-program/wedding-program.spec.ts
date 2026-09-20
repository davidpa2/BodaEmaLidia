import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingProgram } from './wedding-program';

describe('WeddingProgram', () => {
  let component: WeddingProgram;
  let fixture: ComponentFixture<WeddingProgram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingProgram]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingProgram);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
