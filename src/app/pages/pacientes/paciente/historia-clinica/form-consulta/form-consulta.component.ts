import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoriaClinica } from '../../../../../core/interfaces/historia-clinica.model';
import { HistoriasClinicasApiService } from '../../../../../core/services/historias-clinicas.service';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../../core/services/snackbar.service';

@Component({
  selector: 'app-form-consulta',
  imports: [FormsModule],
  templateUrl: './form-consulta.component.html',
})
export class FormConsultaComponent {
  @Input() historiaClinica: HistoriaClinica = {
    idHistoriaClinica: 0,
    idPaciente: 0,
    fecha: new Date(),
    motivo_consulta: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    parametros: [],
    created_at: new Date()
  };

  @Output() onFormularioEnviado = new EventEmitter<void>();

  constructor(
            private historiaClinicaService: HistoriasClinicasApiService, 
            private route: ActivatedRoute, private snackbarService: SnackbarService){}
  
  title: string = '';
  modoEdicion: boolean = false;
  idPaciente: number = 0;
  hoy: string = new Date().toISOString().split('T')[0];

  ngOnInit(){
    // Obtener id de paciente
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idPaciente = +id; // Convierte a número
      } else {
        this.snackbarService.show('ID de paciente no encontrado.', 'error');
      }
    });

    if (this.historiaClinica.idHistoriaClinica > 0) {
      this.modoEdicion = true;
      this.title = 'Actualizar Consulta';
    } else {
      this.modoEdicion = false;
      this.historiaClinica.idPaciente = this.idPaciente;
      this.title = 'Agregar Consulta';
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
    if (this.historiaClinica !== undefined) {
      this.historiaClinicaService.crearHistoriaClinica(this.historiaClinica).subscribe(
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
    if (this.historiaClinica !== undefined) {
      this.historiaClinicaService.editarHistoriaClinica(this.historiaClinica).subscribe(
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
    if(this.historiaClinica.parametros !== undefined){
      this.historiaClinica.parametros.push({ nombre: '', valor: '' });
    }
  }
  eliminarParametro(index: number) {
    if(this.historiaClinica.parametros !== undefined){
      this.historiaClinica.parametros.splice(index, 1);
    }
  }
}
