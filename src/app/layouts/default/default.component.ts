import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  sideBarOpen = true;
  isLogged: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLogged.subscribe((res) => {
      this.isLogged = res;
    });
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
