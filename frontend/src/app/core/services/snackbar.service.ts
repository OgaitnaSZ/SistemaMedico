import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

    show(message: string, type: 'success' | 'error') {
      const panelClass = type === 'success' ? ['snackbar-success'] : ['snackbar-error'];
      
      this.snackBar.open(message, 'Cerrar', {
        duration: 4500,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass
      });
    }
}
