import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceForm } from './assistance-form';

describe('AssistanceForm', () => {
  let component: AssistanceForm;
  let fixture: ComponentFixture<AssistanceForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistanceForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
