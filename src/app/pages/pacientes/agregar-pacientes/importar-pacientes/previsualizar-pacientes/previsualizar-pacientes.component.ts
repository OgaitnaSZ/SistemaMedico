import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Paciente } from '../../../../../core/interfaces/paciente.model';
import { PacientesApiService } from '../../../../../core/services/pacientes.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';

@Component({
  selector: 'app-previsualizar-pacientes',
  imports: [CommonModule],
  templateUrl: './previsualizar-pacientes.component.html',
})
export class PrevisualizarPacientesComponent {
  @Input() pacientesImportados: Paciente[] | undefined; // Listado de pacientes recibido del componente padre

  constructor(private pacienteService : PacientesApiService, private router : Router, private snackbarService: SnackbarService){}

  guardarPacientes(){
    if(this.pacientesImportados != undefined && this.pacientesImportados != null){
      this.pacienteService.crearPacientes(this.pacientesImportados).subscribe(
        (response) => {
          this.snackbarService.show('Pacientes agregados con éxito.', 'success');
          this.router.navigate(['/pacientes']);
        },
        (error) => {
          this.snackbarService.show('Error al agregar pacientes.', 'error');
        }
      );
    }
  }

  eliminarPacienteImportado(paciente: Paciente): void {
    if(this.pacientesImportados != undefined && this.pacientesImportados != null){
      this.pacientesImportados = this.pacientesImportados.filter(p => p !== paciente);
    }
  }

}
