import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

    show(message: string, type: 'success' | 'error') {
      const panelClass = type === 'success'
        ? [
            'bg-blue-100',       
            'border',            
            'border-blue-500',    
            'text-blue-700',     
            'font-semibold',      
            'rounded-lg',          
          ]
        : [
            'bg-red-100',          
            'border',
            'border-red-500',
            'text-red-700',
            'font-semibold',
            'rounded-lg',
          ];
        
        this.snackBar.open(message, 'Cerrar', {
        duration: 10000,
        verticalPosition: 'bottom',
        panelClass
        });
    }
}
