import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Paciente } from '../../../core/interfaces/paciente.model';
import { RouterLink, Router } from '@angular/router';
import { PacientesApiService } from '../../../core/services/pacientes.service';

@Component({
  selector: 'app-agregar-paciente',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agregar-paciente.component.html',
  styleUrl: './agregar-paciente.component.css'
})
export class AgregarPacienteComponent {
  constructor(private pacienteService: PacientesApiService, private router: Router){}

  mensaje: string = '';

  // Variable de paciente
  pacienteNuevo: Paciente = {
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

  guardarPaciente(): void {
    if (!this.pacienteNuevo.nombre || !this.pacienteNuevo.apellido || !this.pacienteNuevo.genero || !this.pacienteNuevo.dni || !this.pacienteNuevo.fechaNacimiento) {
      this.mensaje = 'Por favor, completá todos los campos obligatorios.';
      return;
    }
    this.pacienteService.crearPaciente(this.pacienteNuevo).subscribe(
      (response) => {
        console.log('Paciente agregado:', response);
        this.router.navigate(['/pacientes']);
      },
      (error) => {
        console.error('Error al agregar paciente:', error);
        this.mensaje = 'Error al agregar paciente.';
      }
    );
  }
}