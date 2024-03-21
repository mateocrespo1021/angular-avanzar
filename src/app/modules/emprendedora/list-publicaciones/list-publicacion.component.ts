import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
    selector     : 'list-publicacion',
    standalone   : true,
    templateUrl  : './list-publicacion.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, 
        MatIconModule, MatButtonModule, CommonModule]
})
export class ListEmprePublicacionComponent
{
    /**
     * Constructor
     */
    constructor(private _router: Router)
    {
    }

    redirectToRegisterProducto() {
            this._router.navigate(['/reg-empre-prod']);
          }    

    redirectToRegisterServicio() {
            this._router.navigate(['/reg-empre-serv']);
          }
}
