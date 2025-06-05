import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { Paciente } from '../../../../core/interfaces/paciente.model';
import { PrevisualizarPacientesComponent } from "./previsualizar-pacientes/previsualizar-pacientes.component";

@Component({
  selector: 'app-importar-pacientes',
  imports: [PrevisualizarPacientesComponent],
  templateUrl: './importar-pacientes.component.html',
  styleUrl: './importar-pacientes.component.css'
})
export class ImportarPacientesComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  mensaje: string = '';
  archivoCargado?: File;

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
    this.mensaje = ''; // Limpiar mensaje
    this.pacientesImportados = []; // Limpiar listado

    if (!archivo.name.match(/\.(xls|xlsx)$/)) {
      this.mensaje = 'Por favor, selecciona un archivo Excel válido (.xls o .xlsx)';
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
        const paciente: Paciente = {
          idPaciente: 0, // puedes asignar id temporal o dejar 0 para base de datos
          nombre: fila['Nombre'] || '',
          apellido: fila['Apellido'] || '',
          genero: fila['Género'] || '',
          dni: fila['DNI'] || '',
          fechaNacimiento: this.parsearFecha(fila['Fecha de Nacimiento']),
          telefono: fila['Teléfono'] || '',
          email: fila['Email'] || '',
          direccion: fila['Dirección'] || '',
          created_at: new Date()
        };
        this.pacientesImportados.push(paciente);
      });
  
      this.mensaje = `${this.pacientesImportados.length} pacientes cargados del archivo.`;
      console.log(jsonDatos);
    };
  
    lector.readAsArrayBuffer(archivo);
  }

  // Función para parsear fecha desde string dd/mm/yyyy o yyyy-mm-dd
  parsearFecha(fechaStr: any): Date {
    if (!fechaStr) return new Date();
  
    if (typeof fechaStr === 'string') {
      // Intentar formato dd/mm/yyyy
      const partes = fechaStr.split('/');
      if (partes.length === 3) {
        const dia = Number(partes[0]);
        const mes = Number(partes[1]) - 1; // meses base 0
        const anio = Number(partes[2]);
        return new Date(anio, mes, dia);
      }
  
      // Intentar formato ISO yyyy-mm-dd o similar
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        return fecha;
      }
  
      // Si no se pudo parsear, devolver fecha actual
      return new Date();
    } else if (fechaStr instanceof Date) {
      // Ya es fecha, devolver tal cual
      return fechaStr;
    } else if (typeof fechaStr === 'number') {
      // Puede ser fecha serial Excel: convertir
      // En Excel, fecha serial es el número de días desde 1-1-1900
      // XLSX.utils.sheet_to_json puede devolver la fecha como número
  
      // Convertir serial Excel a fecha JS
      const fecha = XLSX.SSF.parse_date_code(fechaStr);
      if (fecha) {
        return new Date(fecha.y, fecha.m - 1, fecha.d);
      }
    }
  
    // Por defecto fallback a fecha actual
    return new Date();
  }
  
}
