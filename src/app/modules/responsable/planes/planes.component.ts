import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ComposeEmprendedoraComponent } from './composeEmprendedora/composeEmprendedora.component';
import { ModalEmprendedoraComponent } from 'app/modules/admin/modal-emprendedora/modal-emprendedora.component';


@Component({
    selector: 'planes',
    standalone: true,
    templateUrl: './planes.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, NgClass, FuseCardComponent, NgIf, MatIconModule],

})
export class PlanesResponsableComponent {

    clickedButtonValue: number = 0; // Inicializar con 0
    static idPlanSeleccionado: number;

    yearlyBilling: boolean = true;
    /**
     * Constructor
     */
    constructor(
        private confirmationService: FuseConfirmationService,
        private _matDialog: MatDialog
    ) {
    }

    //ABRIR EL MODAL
    openComposeDialog(idPlan:number): void {
        PlanesResponsableComponent.idPlanSeleccionado = idPlan;
        // Abre el diálogo y pasa el idUsuario como dato
        const dialogRef = this._matDialog.open(ComposeEmprendedoraComponent,{
            data: { idPublicacion: idPlan },
          });

        dialogRef.componentInstance.confirmacionCerrada.subscribe((confirmado: boolean) => {
            if (confirmado) {
                dialogRef.close(); // Cierra el diálogo
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

}
