import { Component } from '@angular/core';
import { FormPacientesComponent } from './form-pacientes/form-pacientes.component';
import { ImportarPacientesComponent } from "./importar-pacientes/importar-pacientes.component";

@Component({
  selector: 'app-agregar-pacientes',
  imports: [FormPacientesComponent, ImportarPacientesComponent],
  templateUrl: './agregar-pacientes.component.html',
})
export class AgregarPacientesComponent {

}
