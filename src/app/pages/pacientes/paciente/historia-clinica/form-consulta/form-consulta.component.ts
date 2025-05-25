import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoriaClinica } from '../../../../../core/interfaces/historia-clinica.model';
import { HistoriasClinicasApiService } from '../../../../../core/services/historias-clinicas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-consulta',
  imports: [FormsModule],
  templateUrl: './form-consulta.component.html',
  styleUrl: './form-consulta.component.css'
})
export class FormConsultaComponent {
  @Input() idHistoriaClinica: number | undefined; // ID recibido del componente padre
  @Output() onFormularioEnviado = new EventEmitter<void>();

    constructor(
              private historiaClinicaService: HistoriasClinicasApiService, 
              private route: ActivatedRoute){}

  mensaje: string = '';
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
        console.log('ID de Paciente no encontrado');
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
        console.log('Consulta agregada:', response);
        // Emitir el evento al padre
        this.onFormularioEnviado.emit();
      },
      (error) => {
        console.error('Error al agregar consulta:', error);
        this.mensaje = 'Error al agregar consulta.';
      }
    );
  }

  actualizarConsulta(){
    this.historiaClinicaService.editarHistoriaClinica(this.historiaClinica).subscribe(
      (response) => {
        console.log('Consulta actualizada:', response);
        // Emitir el evento al padre
        this.onFormularioEnviado.emit();
      },
      (error) => {
        console.error('Error al actualizar consulta:', error);
        this.mensaje = 'Error al actualizar consulta.';
      }
    );
  }

  cargarConsulta(){
    if(this.idHistoriaClinica !== undefined){
      this.historiaClinicaService.getHistoriaClinica(this.idHistoriaClinica).subscribe(
        (response) => {
          console.log('Historia clinica encontrada:', response);
          this.historiaClinica = response;
        },
        (error) => {
          console.error('Error al encontrar historia clinica:', error);
          this.mensaje = 'Error al encontrar historia clinica.';
        }
      );
    }
  }
}
