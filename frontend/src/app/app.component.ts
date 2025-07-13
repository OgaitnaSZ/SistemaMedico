import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgClass],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'app-sistema-medico';
  constructor(public router: Router) {}

  ngOnInit(): void {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }

}
