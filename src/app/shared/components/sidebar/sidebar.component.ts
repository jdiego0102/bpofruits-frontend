import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../../models/menuItem.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  // Variables para mostrar en sidebar, datos del usuario
  username: any = 'Nombre de usuario';
  email: any = 'Correo electrónico';
  // Mostrar menú
  menu: MenuItem[] = [];
  constructor() {
    // Obtener valores de localstorage
    this.username = localStorage.getItem('username');
    this.email = localStorage.getItem('email');
  }

  ngOnInit(): void {
    // Menú temporal
    this.menu = [
      {
        displayName: 'Dashboard',
        iconName: 'dashboard',
        route: '/admin',
      },
      {
        displayName: 'Predio',
        iconName: 'terrain',
        // route: '/predio',
        children: [
          {
            displayName: 'Crear Predio',
            iconName: 'add_circle_outline',
            route: '/predios-list',
          },
          {
            displayName: 'Ver Predios (Admin)',
            iconName: 'list_alt',
            route: '/predios-list',
          },
        ],
      },
      {
        displayName: 'Cultivos',
        iconName: 'local_florist',
        // route: '/crops',
        children: [
          {
            displayName: 'Crear Cultivo',
            iconName: 'note_add',
            route: '/crops',
          },
          {
            displayName: 'Info. Técnica Cultivo',
            iconName: 'assignment',
            route: '/infoTec',
          },
          {
            displayName: 'Ver Cultivos (Admin)',
            iconName: 'note_add',
            route: '/crops',
          },
        ],
      },
      {
        displayName: 'Cuenta',
        iconName: 'account_box',
        route: '/actor',
      },
    ];
  }
}
