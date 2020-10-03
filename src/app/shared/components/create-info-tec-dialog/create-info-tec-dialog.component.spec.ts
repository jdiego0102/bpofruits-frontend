import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfoTecDialogComponent } from './create-info-tec-dialog.component';

describe('CreateInfoTecDialogComponent', () => {
  let component: CreateInfoTecDialogComponent;
  let fixture: ComponentFixture<CreateInfoTecDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInfoTecDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoTecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
