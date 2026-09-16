import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../core/services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  nombreDoctor: string = 'Doctor';
  usuario: string = '';

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.nombreDoctor = this.loginService.getUserName() || 'Doctor';
    this.usuario = this.loginService.getUser() || 'admin';
  }

  cerrarSession(): void {
    this.loginService.logout();
  }

  getIniciales(nombre: string): string {
    if (!nombre) return 'DR';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }
}
