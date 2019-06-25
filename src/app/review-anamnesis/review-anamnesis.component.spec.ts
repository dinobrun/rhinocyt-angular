import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAnamnesisComponent } from './review-anamnesis.component';

describe('ReviewAnamnesisComponent', () => {
  let component: ReviewAnamnesisComponent;
  let fixture: ComponentFixture<ReviewAnamnesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewAnamnesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAnamnesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
