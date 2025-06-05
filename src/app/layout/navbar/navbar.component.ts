import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../core/services/login.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  collapsed: boolean = true;

  constructor(private loginService: LoginService){}

  cerrarSession(){
    this.loginService.logout();
  }
}
