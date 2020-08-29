import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  // Variables para mostrar en sidebar, datos del usuario
  username: any = 'Nombre de usuario';
  email: any = 'Correo electrónico';
  constructor() {
    // Obtener valores de localstorage
    this.username = localStorage.getItem('username');
    this.email = localStorage.getItem('email');
  }

  ngOnInit(): void {}
}
