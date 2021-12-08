import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionStepComponent } from './instruction-step.component';

describe('InstructionStepComponent', () => {
  let component: InstructionStepComponent;
  let fixture: ComponentFixture<InstructionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
