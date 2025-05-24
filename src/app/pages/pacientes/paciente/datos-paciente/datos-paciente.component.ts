import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../../../core/interfaces/paciente.model';
import { PacientesApiService } from '../../../../core/services/pacientes.service';

@Component({
  selector: 'app-datos-paciente',
  imports: [CommonModule],
  templateUrl: './datos-paciente.component.html',
  styleUrl: './datos-paciente.component.css'
})
export class DatosPacienteComponent {
  @Input() idPaciente: number | undefined; // ID recibido del componente padre
  mensaje: string = '';

  constructor(private pacienteService: PacientesApiService){}

  // Variable de paciente
  paciente: Paciente = {
    idPaciente: 0,
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
    if (this.idPaciente !== null && this.idPaciente !== undefined && this.idPaciente > 0) {
      this.pacienteService.getPaciente(this.idPaciente).subscribe(
        (data) => {
          this.paciente = data;
        },
        (error) => {
          console.error('Error al cargar paciente:', error.error);
          this.mensaje = "Paciente no encontrado";
        }
      );
    }
  }
}
