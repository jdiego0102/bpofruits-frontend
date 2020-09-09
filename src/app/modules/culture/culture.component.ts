import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateCropDialogComponent } from 'src/app/shared/components/create-crop-dialog/create-crop-dialog.component';

@Component({
  selector: 'app-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss'],
})
export class CultureComponent implements OnInit {
  constructor(private dialogCreateCrop: MatDialog) {}

  ngOnInit(): void {}

  openDialogCreateCrop(): void {
    const dialog = this.dialogCreateCrop.open(CreateCropDialogComponent);

    dialog.afterClosed().subscribe((crop) => {});
  }
}
