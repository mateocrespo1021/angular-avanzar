
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ElementRef, QueryList, Renderer2, ViewChildren, ViewChild } from '@angular/core';
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
import { ModalPublicacionProductosComponent } from '../home/modal-cliente-publicaciones/modal-cliente-publicacionescomponent';
import { SYSTEM_NAME } from 'assets/resources/helperNombre';


@Component({
  selector: 'home-tienda',
  templateUrl: './home-tienda.component.html',
  styleUrls: ['./home-tienda.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonToggleModule, FormsModule, NgFor, FuseCardComponent, MatButtonModule, MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe],


})
export class HomeTiendaInvitadoComponent {

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;

  public comentariosVisible: boolean = false;
  user: User;
  publicaciones$: Observable<InventarioPublicaciones[]>;
  currentImageIndex: [0];
  static publicacionSeleccionada: number;
  publications: InventarioPublicaciones[] = [];
  dataSource: MatTableDataSource<InventarioPublicaciones>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //Nombre EvaMarket
  systemName = SYSTEM_NAME;


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
  redirectToShop(): void {
    this._router.navigate(['/shop-avanzar']);
  }

  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  //ABRIR EL MODAL
  openComposeDialog(): void {
    const dialogRef = this._matDialog.open(ModalPublicacionProductosComponent, {

    });


    dialogRef.afterClosed().subscribe((result) => {
      console.log('Compose dialog was closed!');
    });
  }

}
