import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Consulta } from '../../../../../core/interfaces/consulta.model';
import { ConsultasApiService } from '../../../../../core/services/consultas.service';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../../core/services/snackbar.service';

@Component({
  selector: 'app-form-consulta',
  imports: [FormsModule],
  templateUrl: './form-consulta.component.html',
})
export class FormConsultaComponent {
  @Input() consulta: Consulta = {
    _id: '',
    idPaciente: '',
    fecha: new Date().toISOString().substring(0, 10),
    motivoConsulta: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    parametros: []
  };

  @Output() onFormularioEnviado = new EventEmitter<void>();

  constructor(
            private consultaService: ConsultasApiService, 
            private route: ActivatedRoute, private snackbarService: SnackbarService){}
  
  title: string = '';
  modoEdicion: boolean = false;
  idPaciente: string = '';
  hoy: string = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  ngOnInit(){
    // Obtener id de paciente
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idPaciente = id; // Convierte a número
      } else {
        this.snackbarService.show('ID de paciente no encontrado.', 'error');
      }
    });

    // Formatear fecha para el input
    this.consulta.fecha = new Date(this.consulta.fecha).toISOString().substring(0, 10);

    if (this.consulta._id != '') {
      this.modoEdicion = true;
      this.title = 'Actualizar consulta';
    } else {
      this.modoEdicion = false;
      this.consulta.idPaciente = this.idPaciente;
      this.title = 'Agregar consulta';
    }
  }

  guardarConsulta(): void {
    if (!this.modoEdicion) {
      this.crearConsulta();
    } else {
      this.actualizarConsulta();
    }
  }

  crearConsulta(){
    if (this.consulta !== undefined) {
      this.consultaService.crearConsulta(this.consulta).subscribe(
        (response) => {
          this.snackbarService.show('Consulta creada con éxito.', 'success');
          // Emitir el evento al padre
          this.onFormularioEnviado.emit();
        },
        (error) => {
          this.snackbarService.show('Error al agregar consulta.', 'error');
          console.log(error);
        }
      )
    }
  }

  actualizarConsulta(){
    if (this.consulta !== undefined) {
      this.consultaService.editarConsulta(this.consulta).subscribe(
        (response) => {
          this.snackbarService.show('Consulta actualizada con éxito.', 'success');
          // Emitir el evento al padre
          this.onFormularioEnviado.emit();
        },
        (error) => {
          this.snackbarService.show('Error al actualizar consulta.', 'error');
        }
      );
    }
  }

  agregarParametro() {
    if(this.consulta.parametros !== undefined){
      this.consulta.parametros.push({ nombre: '', valor: '' });
    }
  }
  eliminarParametro(index: number) {
    if(this.consulta.parametros !== undefined){
      this.consulta.parametros.splice(index, 1);
    }
  }
}
