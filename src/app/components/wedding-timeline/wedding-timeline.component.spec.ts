import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingTimelineComponent } from './wedding-timeline.component';

describe('WeddingTimelineComponent', () => {
  let component: WeddingTimelineComponent;
  let fixture: ComponentFixture<WeddingTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
