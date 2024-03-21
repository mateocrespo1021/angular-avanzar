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
import { NgIf, NgFor } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { PersonaService } from 'app/services/services/persona.service';
import { Vendedor } from 'app/services/models/vendedora';
import { VendedorService } from 'app/services/services/vendedora.service';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { DatePipe } from '@angular/common';
import { Publicacion } from 'app/services/models/publicaciones';
import { SYSTEM_NAME } from 'assets/resources/helperNombre';
@Component({
    selector     : 'profile-emprendedora',
    standalone   : true,
    templateUrl  : './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink,DatePipe,NgFor, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, NgClass, UserComponent, NgIf],

})
export class ProfileEmprendedoraComponent
{
   
    /**
     * Constructor
     */
    user: User;
    userExtraido: any;
    nombreUsuario: string;

    totalPublicaciones: number = 0;
    totalComentarios: number= 0;
    idUsuario: any;
    idVendedor: any;
    vendedorLogueado: Vendedor;
     //Nombre EvaMarket
     systemName=SYSTEM_NAME;

   Listpublicaciones: Publicacion[]=[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(private _userService: UserService , private _router: Router,  
        private _personaService: PersonaService,     private vendedoraService: VendedorService, private publicacionservice: PublicacionesService) {
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

        const parsedData = JSON.parse(localStorage.getItem('user'));
        this.nombreUsuario = parsedData.persona.primer_nombre;

        this.idUsuario = parsedData.id;

        this.vendedoraService.buscarVendedoraId(this.idUsuario).subscribe((vendedor: Vendedor) => {
            this.idVendedor = vendedor.idVendedor;
            this.obtenerResumen2();
        });


    }

    obtenerResumen2(): void {
        this._personaService.obtenerResumen2(this.idVendedor).subscribe((res) => {
            this.totalPublicaciones = res.totalpublicaciones;
            this.publicacionservice.listPublicacionesUs(this.idVendedor).subscribe( (publicaciones) => {
                this.Listpublicaciones= publicaciones;
            
            });

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
        this._router.navigate(['/dash-empre']);
    }
    redirectToPlanes(): void {
        this._router.navigate(['/subscripcion-empre']);
    }
    redirectToConfiguration(): void {
        this._router.navigate(['/config-empre']);
    }
}

