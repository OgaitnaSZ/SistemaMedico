import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormPacientesComponent } from './form-pacientes/form-pacientes.component';
import { ImportarPacientesComponent } from "./importar-pacientes/importar-pacientes.component";

@Component({
  selector: 'app-agregar-pacientes',
  imports: [CommonModule, RouterLink, FormPacientesComponent, ImportarPacientesComponent],
  templateUrl: './agregar-pacientes.component.html',
})
export class AgregarPacientesComponent implements OnInit {
  pestanaActiva: 'individual' | 'importar' = 'individual';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    if (this.router.url.includes('importar')) {
      this.pestanaActiva = 'importar';
    }

    this.route.queryParams.subscribe((params) => {
      if (params['tab'] === 'importar' || params['modo'] === 'excel') {
        this.pestanaActiva = 'importar';
      } else if (params['tab'] === 'individual') {
        this.pestanaActiva = 'individual';
      }
    });
  }

  cambiarPestana(tab: 'individual' | 'importar') {
    this.pestanaActiva = tab;
  }
}
