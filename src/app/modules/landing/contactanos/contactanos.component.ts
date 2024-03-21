import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { SYSTEM_NAME } from 'assets/resources/helperNombre';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector     : 'contactanos',
    standalone   : true,
    templateUrl  : './contactanos.component.html',
    encapsulation: ViewEncapsulation.None,
    imports      : [MatButtonModule, RouterLink, MatIconModule, MatInputModule,FuseCardComponent ],

})
export class ContactanosComponent
{
    //Nombre EvaMarket
    systemName=SYSTEM_NAME;

    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        categorySlug$ : new BehaviorSubject('all'),
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false),
    };

    /**
     * Constructor
     */
    constructor(private _router: Router)
    {
    }

    redirectToTienda(): void {
        this._router.navigate(['/contactanos']);
    }

    redirectToNosotros(): void {
        this._router.navigate(['/nosotros']);
    }

    redirectToPlanes(): void {
        this._router.navigate(['/planes']);
    }

    redirectToHome(): void {
        this._router.navigate(['/home']);
    }


   
   filterByQuery(query: string): void
   {
       this.filters.query$.next(query);
   }


   
}
