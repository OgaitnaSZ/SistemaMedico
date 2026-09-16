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
  @Input() paciente: Paciente = {
    _id: '',
    nombre: '',
    apellido: '',
    genero: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    healthInsurance: '',
    createdAt: new Date
  };
  
  constructor(private pacienteService: PacientesApiService, private snackbarService: SnackbarService){}

  ngOnInit(): void {}

  calcularEdad(fechaNacimiento?: string | Date): number | null {
    if (!fechaNacimiento) return null;
    const fecha = new Date(fechaNacimiento);
    if (isNaN(fecha.getTime())) return null;

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    const dia = hoy.getDate() - fecha.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) {
      edad--;
    }

    return edad;
  }

  obtenerIniciales(nombre?: string, apellido?: string): string {
    const n = (nombre || '').trim().charAt(0).toUpperCase();
    const a = (apellido || '').trim().charAt(0).toUpperCase();
    return `${n}${a}` || 'P';
  }
}
