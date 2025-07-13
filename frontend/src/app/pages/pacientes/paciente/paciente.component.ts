import { Component } from '@angular/core';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DatosPacienteComponent } from './datos-paciente/datos-paciente.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { PacientesApiService } from '../../../core/services/pacientes.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-paciente',
  imports: [RouterLink, DatosPacienteComponent, HistoriaClinicaComponent],
  templateUrl: './paciente.component.html',
})
export class PacienteComponent {
  idPaciente: number = 0;

  constructor(private route: ActivatedRoute, 
              private pacienteService: PacientesApiService,
              private router: Router,
              private snackbarService: SnackbarService){}

  ngOnInit(){
    // Obtener el parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idPaciente = +id; // Convierte a número
      } else {
        this.snackbarService.show('ID de paciente no encontrado.', 'error');
      }
    });
  }

  eliminarPaciente(){
    if (confirm(`¿Estás seguro de que deseas eliminar el paciente}?`)) {
      this.pacienteService.eliminarPaciente(this.idPaciente).subscribe(
        (response) => {
          this.snackbarService.show('Eliminación exitosa.', 'success');
          this.router.navigate(['/pacientes']);
        },
        (error) => {
          this.snackbarService.show('Error al eliminar pacientes.', 'error');
        }
      );
    }
  }
}
