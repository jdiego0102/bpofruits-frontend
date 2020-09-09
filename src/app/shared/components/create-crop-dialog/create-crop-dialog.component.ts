import { Component, OnInit, Inject, TemplateRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HarvestData } from '../../../models/culture.interface';

const HARVEST_DATA_EXAMPLE: HarvestData[] = [
  { date: '2020-09-28', quality: 'Label 1', tons: 1.0079 },
  { date: '2020-09-28', quality: 'Label 2', tons: 4.0026 },
  { date: '2020-09-28', quality: 'Label 3', tons: 6.941 },
];
@Component({
  selector: 'app-create-crop-dialog',
  templateUrl: './create-crop-dialog.component.html',
  styleUrls: ['./create-crop-dialog.component.scss'],
})
export class CreateCropDialogComponent implements OnInit {
  displayedColumns: string[] = ['date', 'quality', 'tons'];
  dataSource = HARVEST_DATA_EXAMPLE;

  @Input() templateRef: TemplateRef<any>;
  constructor(public dialogRef: MatDialogRef<CreateCropDialogComponent>) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }
}
