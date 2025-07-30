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
    createdAt: new Date
  };
  
  constructor(private pacienteService: PacientesApiService, private snackbarService: SnackbarService){}

  ngOnInit(): void {

  }
}
