import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosPacienteComponent } from './datos-paciente/datos-paciente.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { PacientesApiService } from '../../../core/services/pacientes.service';
import { HistoriaClinica } from '../../../core/interfaces/historia-clinica.model';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, RouterLink, DatosPacienteComponent, HistoriaClinicaComponent],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent {
  idPaciente: number = 0;

  constructor(private route: ActivatedRoute, private pacienteService: PacientesApiService){}

  ngOnInit(){
    // Obtener el parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idPaciente = +id; // Convierte a número
        console.log('ID de Paciente:', this.idPaciente);
      } else {
        console.log('ID de Paciente no encontrado');
      }
    });
  }
}
