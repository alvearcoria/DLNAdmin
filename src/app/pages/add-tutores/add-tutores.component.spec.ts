import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTutoresComponent } from './add-tutores.component';

describe('AddTutoresComponent', () => {
  let component: AddTutoresComponent;
  let fixture: ComponentFixture<AddTutoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTutoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
