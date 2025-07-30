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
    fechaNacimiento: new Date().toISOString().substring(0, 10),
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
  
      // Tomar la primera hoja del Excel
      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];
  
      // Convertir a JSON
      const jsonDatos: any[] = XLSX.utils.sheet_to_json(hoja, { defval: '' });
  
      // Limpiar el arreglo de pacientes importados antes de cargar nuevos
      this.pacientesImportados = [];

      // Función para convertir fechas de Excel (número de serie) a formato ISO
      const convertirFecha = (fecha: any) => {
        // Si es un número (probable valor de fecha de Excel)
        if (!isNaN(fecha) && fecha !== '') {
          const excelDate = new Date((fecha - 25569) * 86400 * 1000);  // Excel fecha base
          return excelDate.toISOString().split('T')[0]; // Devuelve en formato YYYY-MM-DD
        }
        return fecha;  // Si no es un número, devolver el valor tal cual
      };
  
      // Mapear datos del Excel a modelo Paciente
      jsonDatos.forEach((fila, index) => {
        // Convertimos los valores del objeto a un array en orden de aparición
        const valores = Object.values(fila).map(v => v !== undefined && v !== null ? String(v) : '');
        console.log(valores);
        const paciente: Paciente = {
            nombre: valores[0] || '',
            apellido: valores[1] || '',
            genero: valores[2] || '',
            dni: valores[3] || '',
            fechaNacimiento: convertirFecha(valores[4]),
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
}
