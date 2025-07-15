import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../../../core/interfaces/paciente.model';
import { PacientesApiService } from '../../../../core/services/pacientes.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-datos-paciente',
  imports: [CommonModule],
  templateUrl: './datos-paciente.component.html',
})
export class DatosPacienteComponent {
  @Input() idPaciente: string | undefined; // ID recibido del componente padre

  constructor(private pacienteService: PacientesApiService, private snackbarService: SnackbarService){}

  // Variable de paciente
  paciente: Paciente = {
    idPaciente: '',
    nombre: '',
    apellido: '',
    genero: '',
    dni: '',
    fechaNacimiento: new Date,
    telefono: '',
    email: '',
    direccion: '',
    created_at: new Date
  };

  ngOnInit(): void {
    // Cargar Datos de Paciente
    if (this.idPaciente !== undefined && this.idPaciente != '') {
      this.pacienteService.getPaciente(this.idPaciente).subscribe(
        (data) => {
          this.paciente = data;
        },
        (error) => {
          console.error('Error al cargar paciente:', error.error);
          this.snackbarService.show('Paciente no encontrado', 'error');
        }
      );
    }
  }
}
