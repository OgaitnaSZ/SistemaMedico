import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { PacienteComponent } from './pages/pacientes/paciente/paciente.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth.guard';
import { FormPacientesComponent } from './pages/pacientes/agregar-pacientes/form-pacientes/form-pacientes.component';
import { AgregarPacientesComponent } from './pages/pacientes/agregar-pacientes/agregar-pacientes.component';

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
            { path: 'pacientes/agregar-paciente', component: AgregarPacientesComponent },
            { path: 'pacientes/modificar-paciente/:id', component: FormPacientesComponent },
            { path: 'pacientes/:id', component: PacienteComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];
