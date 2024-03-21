import { Component, OnInit, ChangeDetectorRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseCardComponent } from '@fuse/components/card';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DetalleSubscripcionService } from 'app/services/services/detalleSubscripcion.service';
import { PlanesResponsableComponent } from '../planes.component';
import { SubscripcionService } from 'app/services/services/subscripcion.service';
import { DetalleSubscripcion } from 'app/services/models/detalleSubscripcion';
import { FuseConfirmationService } from '@fuse/services/confirmation';



@Component({
    selector: 'mailbox-compose',
    templateUrl: './composeEmprendedora.component.html',
    styleUrls: ['./composeEmprendedora.component.scss'],
    standalone: true,
    imports: [MatSlideToggleModule, MatSelectModule,MatTableModule,MatPaginatorModule,FuseCardComponent,MatMenuModule,RouterLink, MatOptionModule, MatDatepickerModule, NgFor, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent]

})
export class ComposeEmprendedoraComponent implements OnInit {
    //users: Usuario[] = [];
    detalleSubscripcions: DetalleSubscripcion[]=[];
    displayedColumns: string[] = ['cedula','nombres','subscripcion','renovar'];
    dataSource: MatTableDataSource<DetalleSubscripcion>
    pageSizeOptions: number[] = [1, 5, 10, 50]; // Opciones de tamaño de página
    pageSize: number = 10;
    flashMessage: 'success' | 'error' | null = null;
    @Output() confirmacionCerrada: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


    //Variables de atributos de susbcripcion para mostrar en la vista del modal 
    nombreSubscripcion: string;
    precioSubscripcion: number;
    numeroSubscripciones: number;
    // ... otras propiedades ...

    constructor(
        public matDialogRef: MatDialogRef<ComposeEmprendedoraComponent>,
        private confirmationService: FuseConfirmationService,
        private _SubscripcionService: SubscripcionService,
        private router: Router,
         private _DetalleSubscripcionService: DetalleSubscripcionService,
    ) {
    }


    ngOnInit(): void {
        this._SubscripcionService.SubcripciónById(PlanesResponsableComponent.idPlanSeleccionado)
        .subscribe((detalle) => {    
            // this.nombreSubscripcion = detalle.nombreSubscripcion;
            // this.precioSubscripcion = detalle.precio;
            // this.numeroSubscripciones = detalle.NumPublicaciones;
            if (detalle && detalle.nombreSubscripcion) {
                this.nombreSubscripcion = detalle.nombreSubscripcion;
                this.precioSubscripcion = detalle.precio;
                this.numeroSubscripciones = detalle.NumPublicaciones;
              } else {
                // Manejo del caso en que detalle sea nulo o nombreSubscripcion no esté definido
                // Por ejemplo, asignar valores predeterminados o mostrar un mensaje de error
                this.nombreSubscripcion = 'Nombre de Suscripción no disponible';
                this.precioSubscripcion = 0;
                this.numeroSubscripciones = 0;
              }
            });
        this.listarRegistros();
    }

    listarRegistros() {
        this._DetalleSubscripcionService.obtenerLista().subscribe(
          (datos: DetalleSubscripcion[]) => {
            this.detalleSubscripcions = datos; // Asigna los datos a la propiedad users
            this.dataSource = new MatTableDataSource<DetalleSubscripcion>(datos);
    
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

      nextPage() {
        if (this.paginator.hasNextPage()) {
          this.paginator.nextPage();
        }
      }

      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }

      cambioTamanioPagina(event) {
        this.paginator.pageIndex = event.pageIndex;
        // También puedes agregar un console.log() aquí para depurar
      }

    saveAndClose(): void {
        // Guarda la publicación (implementa esta lógica según tus necesidades)

        // Cierra el diálogo
        this.matDialogRef.close();
    }

    // Otros métodos

    discard(): void {
        this.matDialogRef.close();
    }

    updateDetalleSubscripcion(idDetalleSubscripcion: number) {
        const confirmationDialog = this.confirmationService.open({
            title: 'Precaución',
            message: '¿Esta seguro de renovar el plan?',
            icon: {
                show: true,
                name: 'mat_solid:add_alert',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Renovar',
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
                // Realiza la solicitud PATCH después de confirmar
                this._DetalleSubscripcionService.putDetalleSubscripcion(idDetalleSubscripcion,PlanesResponsableComponent.idPlanSeleccionado).subscribe(
                    (response) => {
                        // Muestra un mensaje de éxito después de la solicitud PATCH
                        const successDialog = this.confirmationService.open({
                            title: 'Éxito',
                            message: 'La renovación del plan ha sido exitosa',
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
                                }
                            }
                        });
    
                        this.saveAndClose();
                    },
                    (error) => {
                        // Manejar cualquier error que pueda ocurrir durante la solicitud PATCH
                        console.error('Error al actualizar:', error);
                    }
                );
            }else{
                confirmationDialog.afterClosed();
            }
        });
    }
    
    }


