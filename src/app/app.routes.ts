import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { PacienteComponent } from './pages/pacientes/paciente/paciente.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth.guard';
import { AgregarPacienteComponent } from './pages/pacientes/agregar-paciente/agregar-paciente.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'configuracion', component: ConfiguracionComponent },
            { path: 'pacientes', component: PacientesComponent },
            { path: 'paciente/:id', component: PacienteComponent },
            { path: 'agregar-paciente', component: AgregarPacienteComponent },
        ]
    },
    { path: '**', redirectTo: '' }
];
