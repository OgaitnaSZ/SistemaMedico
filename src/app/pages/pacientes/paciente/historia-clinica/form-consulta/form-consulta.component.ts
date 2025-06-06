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
  @Input() idHistoriaClinica: number | undefined; // ID recibido del componente padre
  @Output() onFormularioEnviado = new EventEmitter<void>();

    constructor(
              private historiaClinicaService: HistoriasClinicasApiService, 
              private route: ActivatedRoute, private snackbarService: SnackbarService){}

  title: string = '';
  modoEdicion: boolean = false;
  idPaciente: number = 0;
  hoy: string = new Date().toISOString().split('T')[0];

  // Variable de historiaClinica
  historiaClinica: HistoriaClinica = {
    idHistoriaClinica: 0,
    idPaciente: 0,
    fecha: new Date,
    motivo_consulta: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    created_at: new Date
  };

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

    this.historiaClinica.idPaciente = this.idPaciente;

    if (this.idHistoriaClinica !== undefined && this.idHistoriaClinica > 0) {
      this.cargarConsulta();
      this.modoEdicion = true;
      this.title = 'Actualizar Consulta';
    } else {
      this.modoEdicion = false;
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
    this.historiaClinica.idHistoriaClinica = this.idPaciente;

    this.historiaClinicaService.crearHistoriaClinica(this.historiaClinica).subscribe(
      (response) => {
        this.snackbarService.show('Consulta creada con éxito.', 'success');
        // Emitir el evento al padre
        this.onFormularioEnviado.emit();
      },
      (error) => {
        this.snackbarService.show('Error al agregar consulta.', 'error');
      }
    );
  }

  actualizarConsulta(){
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

  cargarConsulta(){
    if(this.idHistoriaClinica !== undefined){
      this.historiaClinicaService.getHistoriaClinica(this.idHistoriaClinica).subscribe(
        (response) => {
          this.historiaClinica = response;
        },
        (error) => {
          this.snackbarService.show('Error al cargar consulta.', 'error');
        }
      );
    }
  }
}
