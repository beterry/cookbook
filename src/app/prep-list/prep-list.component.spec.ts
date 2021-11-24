import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepListComponent } from './prep-list.component';

describe('PrepListComponent', () => {
  let component: PrepListComponent;
  let fixture: ComponentFixture<PrepListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
