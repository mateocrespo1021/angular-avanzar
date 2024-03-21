import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ElementRef, QueryList, Renderer2, ViewChildren , ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ModalClienteComponent } from 'app/modules/admin/modal-cliente/modal-cliente.component';
import { InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { PublicacionesInventory } from 'app/services/services/publicacionesInventory.service';
import { ModalPublicacionProductosComponent } from './modal-cliente-publicaciones/modal-cliente-publicacionescomponent';
import { OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith, map } from 'rxjs/operators';
import { of } from 'rxjs'; // <-- import the module
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { SYSTEM_NAME } from 'assets/resources/helperNombre';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls    : ['./home.component.scss'],
    standalone: true,
    imports: [AsyncPipe, NgxPaginationModule, NgIf, MatButtonToggleModule, FormsModule, NgFor, FuseCardComponent, MatButtonModule, MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe],

})
export class LandingHomeComponent {

    @ViewChildren(FuseCardComponent, {read: ElementRef}) private _fuseCards: QueryList<ElementRef>;

    public comentariosVisible: boolean = false;
    user: User;
    publicaciones$: Observable<InventarioPublicaciones[]>;
    currentImageIndex: [0];
    static publicacionSeleccionada: number;
    publications:InventarioPublicaciones[]=[];
    dataSource: MatTableDataSource<InventarioPublicaciones>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
     //Nombre EvaMarket
     systemName=SYSTEM_NAME;

    publicacionesOriginales: any[] = [];
    publicacionesFiltradas: any[] = [];
    mostrarHistorial = false;
    /**
     * Constructor
     */
    constructor(private _router: Router,    
        private _inventoryService: PublicacionesInventory,
        private _matDialog: MatDialog,
        ) {

    }
    
    ngOnInit(): void {
      
        this.publicaciones$ = this._inventoryService.publicaciones$;
        this.publicaciones$.subscribe((publicaciones) => {
          this.publicacionesOriginales = publicaciones;
          this.publicacionesFiltradas = publicaciones;
        });
        
      }

buscarPublicaciones(textoBusqueda: string) {
  const busqueda = textoBusqueda.trim().toLowerCase();

  if (busqueda === '') {
    this.publicacionesFiltradas = this.publicacionesOriginales;
  } else {
    this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
      return (
        publicacion.tituloPublicacion.toLowerCase().includes(busqueda) ||
        publicacion.descripcionPublicacion.toLowerCase().includes(busqueda)||
        publicacion.productos?.nombreProducto.toLowerCase().includes(busqueda)||
        publicacion.productos?.descripcionProducto.toLowerCase().includes(busqueda)||
        publicacion.servicios?.nombreServicio.toLowerCase().includes(busqueda)||
        publicacion.servicios?.descripcionServicio.toLowerCase().includes(busqueda)
      );
    });
  }
}

buscarProductos() {
  const busquedaP = "productos";
    this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
      return (
        publicacion.categoria?.nombreCategoria.toLowerCase().includes(busquedaP)
      );
    });
}
buscartodo() {
  this.publicacionesFiltradas = this.publicacionesOriginales;
}
buscarServicios(){
  const busquedaS = "servicios";
  this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
    return (
      publicacion.categoria?.nombreCategoria.toLowerCase().includes(busquedaS)
    );
  });
}
buscarGastronomia(){
  const busquedaG = "gastronomia";
  this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
    return (
      publicacion.categoria?.nombreCategoria.toLowerCase().includes(busquedaG)
    );
  });
}
public historial: string[] = [];
public textoBusqueda: string = '';

historialBusqueda() {
  const busqueda = this.textoBusqueda.trim().toLowerCase();
  if (busqueda !== '' && !this.historial.includes(busqueda)) {
      this.historial.push(busqueda);
      this.mostrarHistorial = true;
      setTimeout(() => {
        this.mostrarHistorial = false;
        this.textoBusqueda="";
      }, 5000);
    
  }
}
cerrarHistorial(){
  this.mostrarHistorial = false;
  setTimeout(() => {
    this.textoBusqueda="";
  }, 5000);
}

seleccionarTermino(termino: string) {
  this.textoBusqueda = termino;
  this.historialBusqueda();
}
eliminarTermino(termino: string) {
  this.historial = this.historial.filter(item => item !== termino);
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

    nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  } 

  //ABRIR EL MODAL
  openComposeDialog(): void {
    const dialogRef = this._matDialog.open(ModalPublicacionProductosComponent,{
      
    });
  
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Compose dialog was closed!');
    });
  }

  public page!:number;
  

}
