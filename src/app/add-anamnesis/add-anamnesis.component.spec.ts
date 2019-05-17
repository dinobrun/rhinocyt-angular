import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnamnesisComponent } from './add-anamnesis.component';

describe('AddAnamnesisComponent', () => {
  let component: AddAnamnesisComponent;
  let fixture: ComponentFixture<AddAnamnesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnamnesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnamnesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
