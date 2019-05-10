import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcellsComponent } from './addcells.component';

describe('AddcellsComponent', () => {
  let component: AddcellsComponent;
  let fixture: ComponentFixture<AddcellsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcellsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
