import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Productos } from 'app/services/models/productos';
import { ProductosService } from 'app/services/services/producto.service';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
//DIALOGOS
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from 'app/modules/responsable/composeServicios/composeServicios.component';
import { Publicacion, PublicacionB } from 'app/services/models/publicaciones';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { ServiciosService } from 'app/services/services/servicios.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';


@Component({
  selector: 'list-servicios',
  standalone: true,
  templateUrl: './list-servicios.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, CommonModule],
})
export class ListRespServiciosComponent {
  displayedColumns: string[] = ['nombreProducto', 'precioProducto', 'cantidaDisponible', 'vendedor', 'estado', 'editar', 'delete'];
  dataSource: MatTableDataSource<Publicacion>;


  pageSizeOptions: number[] = [1, 5, 10, 50]; // Opciones de tamaño de página
  pageSize: number = 10;

  static idPublicacionSeleccionado: number;

  publicacion: Publicacion[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;
  constructor(private publicacionService: PublicacionesService, private _router: Router, private _matDialog: MatDialog
    , private serviciosService: ServiciosService, private confirmationService: FuseConfirmationService,) {
  }
  ngOnInit(): void {
    this.listarRegistrosServicios();

  }

  cambioTamanioPagina(event) {
    this.paginator.pageIndex = event.pageIndex;
    // También puedes agregar un console.log() aquí para depurar
  }
  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  listarRegistrosServicios() {
    this.publicacionService.listarPublicacionesServicios().subscribe(
      (datos: Publicacion[]) => {
        this.publicacion = datos;
        this.dataSource = new MatTableDataSource<Publicacion>(datos);
        this.dataSource.paginator = this.paginator;
        this.paginator.length = datos.length;
        // Llama a nextPage() después de configurar el paginador
        this.nextPage();
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de los productos:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    // Filtra los datos por título, fecha, nombre del producto y nombre del vendedor
    this.dataSource.filterPredicate = (data: Publicacion, filter: string) => {
      const servicios = data.servicios;
      const vendedora = data.vendedor;

      return (
        data.tituloPublicacion.toLowerCase().includes(filter) ||
        servicios.nombreServicio.toLowerCase().includes(filter) ||
        vendedora.usuario.name.toLowerCase().includes(filter)
      );
    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  //ABRIR EL MODAL
  openComposeDialog(idPublicacion: number): void {
    // Abre el diálogo y pasa el idUsuario como dato

    ListRespServiciosComponent.idPublicacionSeleccionado = idPublicacion;
    const dialogRef = this._matDialog.open(MailboxComposeComponent);

    dialogRef.componentInstance.confirmacionCerrada.subscribe((confirmado: boolean) => {
      if (confirmado) {
        dialogRef.close(); // Cierra el diálogo
        // Realiza otras acciones aquí si es necesario
        this.listarRegistrosServicios();
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Compose dialog was closed!');
    });
  }


  ////////eliminado lógico de servicios
  selectedPublicacion: any;
  tituloPublicacionSelect: any;
  verficarEstado: any;
  seleccionarServicio(publicacion: any) {
    this.selectedPublicacion = publicacion.idPublicacion;
    this.tituloPublicacionSelect = publicacion.tituloPublicacion;
    this.publicacionService.BuscarTituloPublicacion(this.tituloPublicacionSelect).subscribe(
      (servicioEncontrado) => {
        this.verficarEstado = servicioEncontrado;
        if (this.verficarEstado === null) {
          const confirmationDialog = this.confirmationService.open({
            title: 'Ocurrió un error',
            message: 'Acción no disponible, La publicación ya se encuentra inactiva',
            actions: {
              confirm: {
                show: true,
                label: 'OK',
                color: 'primary'
              },
              cancel: {
                show: false,
                label: 'Cancelar'
              }
            }
          });

        } else {
          const confirmationDialog = this.confirmationService.open({
            title: 'Confirmación',
            message: '¿Está seguro de desactivar esta publicación?',
            icon: {
              show: true,
              name: 'heroicons_outline:information-circle',
              color: 'info',
            },
            actions: {
              confirm: {
                show: true,
                label: 'Si estoy seguro',
                color: 'primary'
              },
              cancel: {
                show: true,
                label: 'Cancelar'
              }
            }
          });
          confirmationDialog.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
              this.publicacionService.eliminadoLogico(this.selectedPublicacion).subscribe(
                (dataprodencontrada) => {
                  const publicacion: PublicacionB = {
                    estado: false,
                    visible: false,
                  };

                  this.publicacionService.updatePublicacionByIdN(this.selectedPublicacion, publicacion).subscribe(
                    (respuesta) => {
                      // Realiza alguna acción adicional si es necesario
                      this.listarRegistrosServicios();

                      const confirmationDialog = this.confirmationService.open({
                        title: 'Éxito',
                        message: 'La publicación ha sido desactivada',
                        icon: {
                          show: true,
                          name: 'heroicons_outline:check-circle',
                          color: 'success',
                        },
                        actions: {
                          confirm: {
                            show: true,
                            label: 'OK',
                            color: 'primary'
                          },
                          cancel: {
                            show: false,
                            label: 'Cancelar'
                          }
                        }
                      });
                    },
                    (error) => {
                      // Maneja el error si la actualización falla
                      console.error('Error al actualizar el estado en la base de datos', error);
                    }
                  );
                });
            } else {

            }
          });


        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} de ${monthNames[monthIndex]} del ${year}`;
  }

  //////////////////////////////llevar datos al compose
  /*selectService:any;
  seleccionarServiceEdit(servicio: any) {
    this.openComposeDialog();
    this.selectService = servicio.idServicio;
    localStorage.setItem("idServiceSelected", String(servicio.idServicio));
  }*/

}