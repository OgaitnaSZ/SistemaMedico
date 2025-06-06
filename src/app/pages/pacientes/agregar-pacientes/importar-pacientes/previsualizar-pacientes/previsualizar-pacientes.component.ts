import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Paciente } from '../../../../../core/interfaces/paciente.model';
import { PacientesApiService } from '../../../../../core/services/pacientes.service';

@Component({
  selector: 'app-previsualizar-pacientes',
  imports: [CommonModule],
  templateUrl: './previsualizar-pacientes.component.html',
  styleUrl: './previsualizar-pacientes.component.css'
})
export class PrevisualizarPacientesComponent {
  @Input() pacientesImportados: Paciente[] | undefined; // Listado de pacientes recibido del componente padre

  constructor(private pacienteService : PacientesApiService, private router : Router){}

  mensaje:string = '';

  guardarPacientes(){
    if(this.pacientesImportados != undefined && this.pacientesImportados != null){
      this.pacienteService.crearPacientes(this.pacientesImportados).subscribe(
        (response) => {
          console.log('Pacientes agregados:', response);
          this.router.navigate(['/pacientes']);
        },
        (error) => {
          console.error('Error al agregar pacientes:', error);
          this.mensaje = 'Error al agregar pacientes.';
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
