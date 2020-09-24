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
        displayName: 'Productores',
        iconName: 'how_to_reg',
        // route: '/predio',
        children: [
          {
            displayName: 'Predio',
            iconName: 'verified_user',
            // route: '/predios-list',
            children: [
              {
                displayName: 'Ver Predios',
                iconName: 'list_alt',
                route: '/predio',
              },
            ],
          },
          {
            displayName: 'Cultivos',
            iconName: 'local_florist',
            // route: '/crops',
            children: [
              {
                displayName: 'Ver Cultivos',
                iconName: 'list_alt',
                route: '/crops',
              },
              {
                displayName: 'Info. Técnica Cultivo',
                iconName: 'assignment',
                route: '/infoTec',
              },
            ],
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
