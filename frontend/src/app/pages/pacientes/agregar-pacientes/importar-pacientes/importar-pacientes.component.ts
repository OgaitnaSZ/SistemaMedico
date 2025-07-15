import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { Paciente } from '../../../../core/interfaces/paciente.model';
import { PrevisualizarPacientesComponent } from "./previsualizar-pacientes/previsualizar-pacientes.component";
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-importar-pacientes',
  imports: [PrevisualizarPacientesComponent],
  templateUrl: './importar-pacientes.component.html',
})
export class ImportarPacientesComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  archivoCargado?: File;

  constructor(private snackbarService: SnackbarService){}

  paciente: Paciente = {
    _id: '',
    nombre: '',
    apellido: '',
    genero: '',
    dni: '',
    fechaNacimiento: new Date,
    telefono: '',
    email: '',
    direccion: '',
    createdAt: new Date
  };
  pacientesImportados: Paciente[] = [];

  abrirSelectorArchivo() {
    this.fileInput.nativeElement.click();
  }

  archivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.procesarArchivo(input.files[0]);
    }
  }

  archivoSoltado(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.procesarArchivo(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  procesarArchivo(archivo: File) {
    this.pacientesImportados = []; // Limpiar listado

    if (!archivo.name.match(/\.(xls|xlsx)$/)) {
      this.snackbarService.show('Selecciona un archivo Excel válido (.xls o .xlsx)', 'error');
      return;
    }
  
    const lector = new FileReader();
    lector.onload = (e) => {
      const data = new Uint8Array(lector.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Tomamos la primera hoja del Excel
      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];
  
      // Convertimos a JSON
      const jsonDatos: any[] = XLSX.utils.sheet_to_json(hoja, { defval: '' });
  
      // Limpiamos el arreglo de pacientes importados antes de cargar nuevos
      this.pacientesImportados = [];
  
      // Mapear datos del Excel a modelo Paciente
      jsonDatos.forEach((fila, index) => {
        // Convertimos los valores del objeto a un array en orden de aparición
        const valores = Object.values(fila).map(v => v !== undefined && v !== null ? String(v) : '');
        console.log(valores);
        const paciente: Paciente = {
            _id: '',
            nombre: valores[0] || '',
            apellido: valores[1] || '',
            genero: valores[2] || '',
            dni: valores[3] || '',
            fechaNacimiento: this.parsearFecha(valores[4]),
            telefono: valores[5] || '',
            email: valores[6] || '',
            direccion: valores[7] || '',
            createdAt: new Date()
        };
        
        this.pacientesImportados.push(paciente);
      });
  
      this.snackbarService.show(`${this.pacientesImportados.length} pacientes cargados`, 'success');
    };
  
    lector.readAsArrayBuffer(archivo);
  }

  // Función para parsear fecha desde string dd/mm/yyyy o yyyy-mm-dd
  parsearFecha(fechaStr: any): Date {
    if (!fechaStr) return new Date();
  
    // Si es número (serial de Excel)
    if (typeof fechaStr === 'number') {
      const fechaExcel = XLSX.SSF.parse_date_code(fechaStr);
      if (fechaExcel) {
        return new Date(fechaExcel.y, fechaExcel.m - 1, fechaExcel.d);
      }
    }
  
    // Si es string, puede ser fecha o número serial como string
    if (typeof fechaStr === 'string') {
      // ¿Es número como string? --> intentar parsearlo como serial de Excel
      if (!isNaN(+fechaStr) && +fechaStr > 10000) {
        const fechaExcel = XLSX.SSF.parse_date_code(+fechaStr);
        if (fechaExcel) {
          return new Date(fechaExcel.y, fechaExcel.m - 1, fechaExcel.d);
        }
      }
  
      // Intentar dd/mm/yyyy
      const partes = fechaStr.split('/');
      if (partes.length === 3) {
        const dia = Number(partes[0]);
        const mes = Number(partes[1]) - 1;
        const anio = Number(partes[2]);
        return new Date(anio, mes, dia);
      }
  
      // Intentar ISO
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        return fecha;
      }
    }
  
    // Si ya es Date
    if (fechaStr instanceof Date) {
      return fechaStr;
    }
  
    return new Date();
  }
}
