import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit, OnDestroy {
  // Controlar sidebar
  sideBarOpen = true;
  // Propiedad para identificar el estado de sesión del usuario
  isLogged: boolean = false;
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
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

  // Ocultar/Mostrar sidebar
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
