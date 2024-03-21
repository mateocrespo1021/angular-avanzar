import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardComponent } from '@fuse/components/card';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { UserComponent } from 'app/layout/common/user/user.component';
import { NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ProductosService } from 'app/services/services/producto.service';
import { SYSTEM_NAME } from 'assets/resources/helperNombre';

@Component({
    selector     : 'profile-responsable',
    standalone   : true,
    templateUrl  : './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, NgClass, UserComponent, NgIf],

})
export class ProfileResponsableComponent
{
    /**
     * Constructor
     */
    user: User;
    userExtraido: any;
     //Nombre EvaMarket
     systemName=SYSTEM_NAME;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(private _userService: UserService, private _router: Router, private productoservice: ProductosService) {
    }

    ngOnInit(): void {

        const userString = localStorage.getItem('user');
        this.userExtraido = JSON.parse(userString);

        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: User) =>
        {
            this.user = user;
        });
    }

    


    formatDate(dateString: string): string {
        const [day, month, year] = dateString.split('/');
        const monthsInSpanish = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        const monthName = monthsInSpanish[parseInt(month) - 1];

        return `${day} de ${monthName} de ${year}`;
    }


    redirectToHome(): void {
        this._router.navigate(['/dash-resp']);
    }
    redirectToPlanes(): void {
        this._router.navigate(['/planes-resp']);
    }
    redirectToConfiguration(): void {
        this._router.navigate(['/config-resp']);
    }



}

