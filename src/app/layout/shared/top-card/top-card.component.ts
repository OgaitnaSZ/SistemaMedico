import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-card',
  imports: [],
  templateUrl: './top-card.component.html',
  styleUrl: './top-card.component.css'
})
export class TopCardComponent {
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() icon: string = 'info';
}