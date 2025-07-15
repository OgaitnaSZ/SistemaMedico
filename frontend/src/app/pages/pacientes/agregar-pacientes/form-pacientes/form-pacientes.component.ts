import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Paciente } from '../../../../core/interfaces/paciente.model';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { PacientesApiService } from '../../../../core/services/pacientes.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-form-pacientes',
  imports: [FormsModule, RouterLink],
  templateUrl: './form-pacientes.component.html',
})
export class FormPacientesComponent {
  constructor(
              private pacienteService: PacientesApiService, 
              private router: Router, private snackbarService: SnackbarService,
              private route: ActivatedRoute){}
  idPaciente: string = '';
  title: string = '';
  modoEdicion: boolean = false;

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

  ngOnInit(){
    // Obtener el parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idPaciente = id; // Convierte a número
      } else if(this.modoEdicion) {
        this.snackbarService.show('Paciente no encontradox.', 'error');
      }
    });

    if (this.idPaciente != '') {
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
      this.snackbarService.show('Completá todos los campos obligatorios.', 'error');
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
        this.snackbarService.show('Paciente creado con éxito.', 'success');
        this.router.navigate(['/pacientes']);
      },
      (error) => {
        console.error('Error al agregar paciente:', error);
        this.snackbarService.show('Error al guardar paciente.', 'error');
        
      }
    );
  }
  actualizarPaciente(){
    this.pacienteService.editarPaciente(this.paciente).subscribe(
      (response) => {
        this.snackbarService.show('Datos actualizados con éxito.', 'success');
        this.router.navigate(['/paciente', this.paciente.idPaciente]);
      },
      (error) => {
        console.error('Error al actualizar paciente:', error);
        this.snackbarService.show('Error al actualizar datos.', 'error');
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
        this.snackbarService.show('Error al cargar paciente.', 'error');
      }
    );
  }
}
