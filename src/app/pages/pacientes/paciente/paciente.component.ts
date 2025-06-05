import { Component } from '@angular/core';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DatosPacienteComponent } from './datos-paciente/datos-paciente.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { PacientesApiService } from '../../../core/services/pacientes.service';

@Component({
  selector: 'app-paciente',
  imports: [RouterLink, DatosPacienteComponent, HistoriaClinicaComponent],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent {
  idPaciente: number = 0;
  mensaje: string = '';

  constructor(private route: ActivatedRoute, 
              private pacienteService: PacientesApiService,
              private router: Router){}

  ngOnInit(){
    // Obtener el parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idPaciente = +id; // Convierte a número
      } else {
        console.log('ID de Paciente no encontrado');
      }
    });
  }

  eliminarPaciente(){
    if (confirm(`¿Estás seguro de que deseas eliminar el paciente}?`)) {
      this.pacienteService.eliminarPaciente(this.idPaciente).subscribe(
        (response) => {
          console.log('Elimnacion exitosa:', response);
          this.router.navigate(['/pacientes']);
        },
        (error) => {
          this.mensaje = "Error al eliminar el paciente.";
        }
      );
    }
  }
}
