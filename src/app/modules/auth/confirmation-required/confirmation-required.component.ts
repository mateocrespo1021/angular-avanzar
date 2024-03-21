import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { SYSTEM_NAME } from 'assets/resources/helperNombre';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [RouterLink],
})
export class AuthConfirmationRequiredComponent
{
     //Nombre EvaMarket
     systemName=SYSTEM_NAME;
    /**
     * Constructor
     */
    constructor()
    {
    }
}
