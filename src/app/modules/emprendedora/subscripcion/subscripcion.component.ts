import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { VendedorService } from 'app/services/services/vendedora.service';
import { DashboardEmprendedoraComponentimplements } from '../dashboard/dashboard.component';

@Component({
    selector: 'subscripcion',
    standalone: true,
    templateUrl: './subscripcion.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, NgClass, FuseCardComponent, NgIf, MatIconModule],
})
export class SubscripcionEmprendedoraComponent implements OnInit {
    yearlyBilling: boolean = true;
    membresiaActual: any;
    fechaFormateada: string; // Variable para almacenar la fecha formateada
    numeroPublicaciones: number;
    precioMembresia: number;

    /**
     * Constructor
     */
    constructor(private _vendedoraService: VendedorService) {
    }

    ngOnInit(): void {

        // Recuperar la variable almacenada en el localStorage en el segundo componente
        const detalleSubscripcion = JSON.parse(localStorage.getItem('extraerMembresia'));
        this.membresiaActual = detalleSubscripcion;
        this.numeroPublicaciones = detalleSubscripcion.subscripcion.numPublicaciones;
        this.precioMembresia = detalleSubscripcion.subscripcion.precio;

        const fecha = new Date(detalleSubscripcion.fechaFin);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();
        this.fechaFormateada = `${dia}/${mes}/${anio}`;
    }




}
