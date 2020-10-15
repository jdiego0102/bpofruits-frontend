import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePredioDialogComponent } from './create-predio-dialog.component';

describe('CreatePredioDialogComponent', () => {
  let component: CreatePredioDialogComponent;
  let fixture: ComponentFixture<CreatePredioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePredioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePredioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
