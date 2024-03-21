import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, } from '@angular/material/paginator';
import { MatTableDataSource, } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from 'app/core/user/user.types';
import { Observable } from 'rxjs';
import { InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { MatDialog } from '@angular/material/dialog';
import { ModalPublicacionComponent } from '../home-tienda/modal-publicacion/modal-publicacion.component';
import { AsyncPipe, NgClass, NgFor, NgIf, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { FuseCardComponent } from '@fuse/components/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PublicacionesInventoryProductos } from 'app/services/services/PublicacionesInventory-Productos.service';
import { ModalPublicacionProductosComponent } from './modal-publicacion-productos/modal-publicacion-productos.component';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { ModalComentariosComponent } from '../home-tienda/modal-comentarios/modal-comentarios.component';
import { SharedFavoritoService } from 'app/services/services/sharedFavoritoService.service';
import { Destacados } from 'app/services/models/destacados';
import { FavoritosService } from 'app/services/services/favoritos.service';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
  selector: 'productos-vent',

  templateUrl: './productos-vent.component.html',
  styleUrls: ['../home-tienda/home-tienda.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgOptimizedImage, AsyncPipe, NgxPaginationModule, NgIf, MatButtonToggleModule, FormsModule, NgFor, FuseCardComponent, MatButtonModule, MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe],

})
export class ProductosVentClientComponent implements OnInit {
  user: User;
  publicaciones$: Observable<InventarioPublicaciones[]>;
  currentImageIndex: [0];
  static publicacionSeleccionada: number;
  publications: InventarioPublicaciones[] = [];
  dataSource: MatTableDataSource<InventarioPublicaciones>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  publicacionesOriginales: any[] = [];
  publicacionesFiltradas: any[] = [];
  public page!: number;
  destacados: Destacados;
  esFavorito: boolean = false;
  destacadoCreated: any;
  banNoServiceFound: boolean = false;



  /**
   * Constructor
   */
  constructor(
    private _inventoryService: PublicacionesInventoryProductos,
    private _matDialog: MatDialog,
    private _publicacionesService: PublicacionesService,
    private _favoritoService: FavoritosService,
    private confirmationService: FuseConfirmationService,
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
      this.banNoServiceFound = false;
    } else {
      this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
        return (
          publicacion.tituloPublicacion.toLowerCase().includes(busqueda) ||
          publicacion.descripcionPublicacion.toLowerCase().includes(busqueda) ||
          publicacion.productos?.nombreProducto.toLowerCase().includes(busqueda) ||
          publicacion.productos?.descripcionProducto.toLowerCase().includes(busqueda)
        );
      });
      if (this.publicacionesFiltradas.length === 0) {
        // No se encontraron servicios que coincidan con la búsqueda
        this.banNoServiceFound = true;
      } else {
        // Se encontraron servicios, por lo que ocultamos el mensaje
        this.banNoServiceFound = false;
      }
    }
  }

  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  listarPublicaciones() {
    this._inventoryService.obtenerListaPublicacionesXProducto().subscribe(
      (datos: InventarioPublicaciones[]) => {
        this.publications = datos; // Asigna los datos a la propiedad users
        this.dataSource = new MatTableDataSource<InventarioPublicaciones>(datos);

        this.dataSource.paginator = this.paginator;
        this.paginator.length = datos.length;
        // Llama a nextPage() después de configurar el paginador
        this.nextPage();
      },
      error => {
        console.error('Ocurrió un error al obtener la lista:', error);
      }
    );
  }

  //ABRIR EL MODAL de detalles
  openComposeDialog(idPublicacion: number): void {
    // Abre el diálogo y pasa el idUsuario como dato
    ProductosVentClientComponent.publicacionSeleccionada = idPublicacion;
    const dialogRef = this._matDialog.open(ModalPublicacionProductosComponent, {
      data: { idPublicacion: idPublicacion },
    });

    dialogRef.componentInstance.confirmacionCerrada.subscribe((confirmado: boolean) => {
      if (confirmado) {
        dialogRef.close(); // Cierra el diálogo
        // Realiza otras acciones aquí si es necesario
        this.listarPublicaciones();
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Compose dialog was closed!');
    });
  }

  //Abrir dialogo de comentarios 
  openComposecomments(idPublicacion: number) {
    const dialogRef = this._matDialog.open(ModalComentariosComponent, {
      data: { idPubli: idPublicacion },
    });
  }

  toggleFavorito(idPublicacion: number) {
    // Acción cuando se hace clic por primera vez

    const userJSON = localStorage.getItem('user');
    const user = JSON.parse(userJSON);

    this._publicacionesService.buscarPublicacionId(idPublicacion).subscribe(
      (datos: InventarioPublicaciones) => {

        this.destacados = new Destacados();
        this.destacados.estadoDestacado = true;
        this.destacados.fecha = new Date().toISOString();
        this.destacados.publicaciones = datos;
        this.destacados.usuario = user;



        this._favoritoService.saveFavorito(this.destacados).subscribe(
          (datos: Destacados) => {
            this.destacadoCreated = datos;

            const confirmationDialog = this.confirmationService.open({
              title: 'Éxito',
              message: 'Agregado Correctamente a Tus Favoritos',
              icon: {
                show: true,
                name: 'heroicons_outline:check-circle',
                color: 'success',
              },
              actions: {
                confirm: {
                  show: false,
                  label: '',
                  color: 'primary'
                },
                cancel: {
                  show: false,
                  label: ''
                }
              }
            });


            setTimeout(() => {
              confirmationDialog.close();
            }, 1000); // 1000 milisegundos (1 segundo)

          },
          error => {

            const confirmationDialog = this.confirmationService.open({
              title: 'Advertencia',
              message: 'Ya se encuentra en tus favoritos',
              icon: {
                show: true,
                name: 'heroicons_outline:exclamation-circle',
                color: 'warning',
              },
              actions: {
                confirm: {
                  show: false,
                  label: '',
                  color: 'primary'
                },
                cancel: {
                  show: false,
                  label: ''
                }
              }
            });


            setTimeout(() => {
              confirmationDialog.close();
            }, 1000); // 1000 milisegundos (1 segundo)

          }
        );
      },
      error => {
        console.error('Ocurrió un error al obtener la lista:', error);
      }
    );

  }


}