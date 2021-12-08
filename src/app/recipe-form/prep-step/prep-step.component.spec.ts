import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepStepComponent } from './prep-step.component';

describe('PrepStepComponent', () => {
  let component: PrepStepComponent;
  let fixture: ComponentFixture<PrepStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
