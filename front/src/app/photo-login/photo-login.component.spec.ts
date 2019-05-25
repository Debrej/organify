import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoLoginComponent } from './photo-login.component';

describe('PhotoLoginComponent', () => {
  let component: PhotoLoginComponent;
  let fixture: ComponentFixture<PhotoLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
