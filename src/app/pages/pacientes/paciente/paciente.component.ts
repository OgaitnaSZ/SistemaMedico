import { Component } from '@angular/core';
import { Paciente } from '../../../core/interfaces/paciente.model';
import { HistoriaClinica } from '../../../core/interfaces/historia-clinica.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent {
  // Variable de paciente
  paciente: Paciente = {
    idPaciente: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    genero: 'Masculino',
    dni: '12345678',
    fechaNacimiento: new Date('1985-04-23'),
    telefono: '+54 9 11 1234-5678',
    email: 'juan.perez@example.com',
    direccion: 'Av. Siempre Viva 742, Buenos Aires',
    created_at: new Date('2023-10-01')
  };

  // Arreglo de historia clínica
  historialClinico: HistoriaClinica[] = [
    {
      idHC: 1,
      idPaciente: 1,
      fecha: new Date('2024-01-15'),
      motivo_consulta: 'Dolor abdominal',
      diagnostico: 'Gastritis',
      tratamiento: 'Omeprazol 20mg por 14 días',
      observaciones: 'Mejoró tras el tratamiento',
      created_at: new Date('2024-01-15')
    },
    {
      idHC: 2,
      idPaciente: 1,
      fecha: new Date('2024-03-10'),
      motivo_consulta: 'Control de rutina',
      diagnostico: 'Sin novedades',
      tratamiento: 'Ninguno',
      observaciones: 'Paciente en buen estado general',
      created_at: new Date('2024-03-10')
    }
  ];
}
