import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Paciente } from '../../../core/interfaces/paciente.model';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { PacientesApiService } from '../../../core/services/pacientes.service';

@Component({
  selector: 'app-form-pacientes',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form-pacientes.component.html',
  styleUrl: './form-pacientes.component.css'
})
export class FormPacientesComponent {
  constructor(
              private pacienteService: PacientesApiService, 
              private router: Router,
              private route: ActivatedRoute){}
  idPaciente: number = 0;
  mensaje: string = '';
  title: string = '';
  modoEdicion: boolean = false;

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

    if (this.idPaciente > 0) {
      this.cargarPaciente();

      this.modoEdicion = true;
      this.title = 'Editar Paciente';
    } else {
      this.modoEdicion = false;
      this.title = 'Nuevo Paciente';
    }
  }

  guardarPaciente(): void {
    if (!this.paciente.nombre || !this.paciente.apellido || !this.paciente.genero || !this.paciente.dni || !this.paciente.fechaNacimiento) {
      this.mensaje = 'Por favor, completá todos los campos obligatorios.';
      return;
    }

    if (!this.modoEdicion) {
      this.crearPaciente();
    } else {
      this.actualizarPaciente();
    }
  }

  crearPaciente(){
    this.pacienteService.crearPaciente(this.paciente).subscribe(
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
  actualizarPaciente(){
    this.pacienteService.editarPaciente(this.paciente).subscribe(
      (response) => {
        console.log('Paciente actualizado:', response);
        this.router.navigate(['/pacientes']);
      },
      (error) => {
        console.error('Error al actualizar paciente:', error);
        this.mensaje = 'Error al actualizar paciente.';
      }
    );
  }
  cargarPaciente(){
    this.pacienteService.getPaciente(this.idPaciente).subscribe(
      (response) => {
        console.log('Paciente encontrado:', response);
        this.paciente = response;
      },
      (error) => {
        console.error('Error al encontrar paciente:', error);
        this.mensaje = 'Error al encontrar paciente.';
      }
    );
  }
}
