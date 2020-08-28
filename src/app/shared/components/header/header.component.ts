import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Propiedad para identificar el estado de sesión del usuario
  isLogged: boolean = false;
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Verificar si el usuario está logueado
    this.subscription.add(
      this.authService.isLogged.subscribe((res) => {
        this.isLogged = res;
      })
    );
  }

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    // this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscription.unsubscribe();
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
