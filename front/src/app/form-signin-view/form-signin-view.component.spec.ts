import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSigninViewComponent } from './form-signin-view.component';

describe('FormSigninViewComponent', () => {
  let component: FormSigninViewComponent;
  let fixture: ComponentFixture<FormSigninViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSigninViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSigninViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
