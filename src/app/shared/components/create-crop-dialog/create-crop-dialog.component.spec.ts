import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCropDialogComponent } from './create-crop-dialog.component';

describe('CreateCropDialogComponent', () => {
  let component: CreateCropDialogComponent;
  let fixture: ComponentFixture<CreateCropDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCropDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCropDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
