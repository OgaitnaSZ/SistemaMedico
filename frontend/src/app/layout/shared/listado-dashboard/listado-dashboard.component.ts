import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listado-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './listado-dashboard.component.html',
})
export class ListadoDashboardComponent {
  @Input() titulo: string = '';
  @Input() items: any[] = [];
  @Input() labelField: string = '';
  @Input() dateField: string = '';
  @Input() linkBase: string = '';
  @Input() verTodasLink?: string;
  @Input() icon: string = 'keyboard_arrow_right';
  @Input() idArchivo: string = '';
}
