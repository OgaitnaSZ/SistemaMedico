import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { PacienteComponent } from './pages/pacientes/paciente/paciente.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'pacientes', component: PacientesComponent},
    { path: 'configuracion', component: ConfiguracionComponent},

    //test
    { path: 'paciente', component: PacienteComponent},
];
