import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAdmin: boolean = false;
  isLogged: boolean = false;
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLogged.subscribe((res) => {
      this.isLogged = res;
    });
  }
  // Ocultar/Mostrar menú
  toggleSiderBar() {
    this.toggleSideBarForMe.emit();
  }
  // Cerrar sesión
  onLogout(): void {
    this.authService.logout();
  }
}
