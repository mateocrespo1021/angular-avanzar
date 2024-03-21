import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventarioServicios, CategoriaServicio, InventarioPublicaciones, CategoriaPublicacion, InventoryPagination } from '../inventoryServicios.types';
import { forkJoin, debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Usuario } from 'app/services/models/usuario';
import { Publicacion } from 'app/services/models/publicaciones';
import { InventoryServiceServicios } from '../inventoryServicios.service';

import { UserService } from 'app/core/user/user.service';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { ServiciosService } from 'app/services/services/servicios.service';
import { User } from 'app/core/user/user.types';
import { ServicioModels } from 'app/services/models/servicios';

//DIALOGOS
import { MatDialog } from '@angular/material/dialog';
import { CategoriaServicioService } from 'app/services/services/categoriaServicio.service';
import { VendedorService } from 'app/services/services/vendedora.service';
import { ModalServicioComponent } from 'app/modules/emprendedora/modal-servicio/modal-servicio.component';
import { DetalleSubscripcionService } from 'app/services/services/detalleSubscripcion.service';


@Component({
    selector: 'inventory-list',
    templateUrl: './inventoryServicios.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 230px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 230px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [NgOptimizedImage, NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe],
})
export class InventoryListComponentService implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    publicaciones$: Observable<InventarioPublicaciones[]>;
    categoriesPublicacion: CategoriaPublicacion[];
    categoriesServicio: CategoriaServicio[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedPublicacion: InventarioPublicaciones | null = null;
    selectedPublicacionForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: Usuario;
    publication = new Publicacion();
    idPublicacion: any;
    servicio = new ServicioModels();
    categoriaExtraida: any;
    banLimitPost = false;
    publicacionesOriginales: any[] = [];
    publicacionesFiltradas: any[] = [];
    titleAlert = "";
    bodyAlert = "";
    banNoServiceFound: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _inventoryService: InventoryServiceServicios,
        private _vendedoraService: VendedorService,
        private _userService: UserService,
        private _categoriaService: CategoriaServicioService,
        private _publicacionService: PublicacionesService,
        private _servicioService: ServiciosService,
        private _matDialog: MatDialog,
        private _detalleSubscripcionService: DetalleSubscripcionService,
        private cd: ChangeDetectorRef
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {


        // Create the selected product form
        this.selectedPublicacionForm = this._formBuilder.group({
            idPublicacion: [''],
            categoria: [''],
            nombreServicio: ['', [Validators.required]],
            tituloPublicacion: ['', [Validators.required]],
            descripcionPublicacion: [''],
            tipos: [''],
            vendedor: [''],
            cantidadDisponible: [''],
            precioInicialServicio: [''],
            precioFinalServicio: [''],
            precioFijoServicio: [''],
            tiempoServicio: [''],
            miniaturaServicio: [''],
            imagenes: [[]],
            currentImageIndex: [0], // Image index that is currently being viewed 
            estado: [false],
        });



        // Get the categoriesProduct
        this._inventoryService.categoriesProducto$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: CategoriaServicio[]) => {
                // Update the categories
                this.categoriesServicio = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._inventoryService.categoriesPublicacion$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categoriesPublicacion: CategoriaPublicacion[]) => {
                // Update the categories
                this.categoriesPublicacion = categoriesPublicacion;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });


        // Get the products

        this.publicaciones$ = this._inventoryService.publicaciones$;
        this.publicaciones$.subscribe((publicaciones) => {
            this.publicacionesOriginales = publicaciones;
            this.publicacionesFiltradas = publicaciones;
        });



        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getPublicacionesServicios(0, 10, 'tituloPublicacion', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'tituloPublicacion',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getPublicacionesServicios(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                }),
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle product details
     *
     * @param publicacionId
     */
    toggleDetails(publicacionId: number): void {
        // If the product is already selected...
        if (this.selectedPublicacion && this.selectedPublicacion.idPublicacion === publicacionId) {
            // Close the details

            this.closeDetails();
            return;
        }

        // Get the product by id
        this._inventoryService.getPublicacionById(publicacionId)
            .subscribe((servicio) => {
                // Set the selected product

                this.selectedPublicacion = servicio;

                this.selectedPublicacionForm.patchValue(servicio);
                this.selectedPublicacionForm.get('nombreServicio').setValue(servicio.servicios.nombreServicio);
                this.selectedPublicacionForm.get('precioInicialServicio').setValue(servicio.servicios.precioInicialServicio);
                this.selectedPublicacionForm.get('precioFinalServicio').setValue(servicio.servicios.precioFinalServicio);
                this.selectedPublicacionForm.get('precioFijoServicio').setValue(servicio.servicios.precioFijoServicio);
                this.selectedPublicacionForm.get('cantidadDisponible').setValue(servicio.servicios.cantidadDisponible);
                this.selectedPublicacionForm.get('tiempoServicio').setValue(servicio.servicios.tiempoServicio);
                this.selectedPublicacionForm.get('vendedor').setValue(servicio.vendedor.usuario.name);
                const selectedCategoryId = servicio.categoria.idCategoria; // Assuming you have an 'id' property in the category object
                this.selectedPublicacionForm.get('tipos').setValue(selectedCategoryId);

                const selectedCategoryIdProducto = servicio.servicios.categoriaServicio.idCategoriaServicio;
                this.selectedPublicacionForm.get('categoria').setValue(selectedCategoryIdProducto);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedPublicacion = null;
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
                    (publicacion.servicios?.nombreServicio && publicacion.servicios.nombreServicio.toLowerCase().includes(busqueda))
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

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void {
        // Get the image count and current image index
        const count = this.selectedPublicacionForm.get('imagenes').value.length;
        const currentIndex = this.selectedPublicacionForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if (forward) {
            this.selectedPublicacionForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else {
            this.selectedPublicacionForm.get('currentImageIndex').setValue(prevIndex);
        }
    }


    /**
     * Update the selected product using the form data
     */

    checkLimitPubliActi(): void {

        if (this.selectedPublicacionForm.get('estado').value) {
            this._detalleSubscripcionService.limitEstatusPost()
                .subscribe({

                    next: (reponse) => {
                        if (reponse.banderaBol) {

                            this.updateselectedPublicacion();
                        } else {
                            this.titleAlert = reponse.title;
                            this.bodyAlert = reponse.body;
                            this.banLimitPost = true;
                            this.cd.detectChanges();
                            setTimeout(() => {

                                this.banLimitPost = false; // Después de 6 segundos, restablece a false
                                this.cd.detectChanges();
                            }, 6000);
                        }
                    },
                    error: (error) => {

                    }
                });
        } else {
            this.updateselectedPublicacion();
        }
    }

    updateselectedPublicacion(): void {
        // Get the product object
        const post = this.selectedPublicacionForm.getRawValue();
        const vendedor$ = this._vendedoraService.buscarVendedoraId(this.user.id);
        const publicacion$ = this._publicacionService.buscarPublicacionId(post.idPublicacion);
        forkJoin([vendedor$, publicacion$]).subscribe(([vendedor, publicacion]) => {
            this.publication.vendedor = vendedor;
            this.publication.servicios = publicacion.servicios;
            this.publication.servicios.miniaturaServicio = " ";
            this.publication.tituloPublicacion = post.tituloPublicacion;
            this.publication.descripcionPublicacion = post.descripcionPublicacion;
            this.publication.estado = post.estado;

            // Ahora que todos los datos están disponibles, puedes actualizar la publicación completa
            this._inventoryService.updatePublicacion(post.idPublicacion, this.publication).subscribe(() => {
                // Show a success message

                this._categoriaService.getCategoriaServicio(post.categoria).subscribe((categoria) => {
                    this.categoriaExtraida = categoria;
                    this.servicio.cantidadDisponible = post.cantidadDisponible;
                    this.servicio.tiempoServicio = post.tiempoServicio;
                    this.servicio.precioInicialServicio = post.precioInicialServicio;
                    this.servicio.precioFinalServicio = post.precioFinalServicio;
                    this.servicio.precioFijoServicio = post.precioFijoServicio;
                    this.servicio.nombreServicio = post.nombreServicio;
                    this.servicio.descripcionServicio = post.descripcionPublicacion;
                    this.servicio.categoriaServicio = this.categoriaExtraida;

                    this._servicioService.actualizarServicioPublicaciones(this.publication.servicios.idServicio, this.servicio).subscribe(() => {
                        // Show a success message
                        this.showFlashMessage('success');
                    });

                });

            });
        });


    }

    /**
     * Delete the selected post using the form data
     */
    deleteselectedPublicacion(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar publicación',
            message: '¿Está seguro de que desea eliminar esta publicación? Esta acción no se puede deshacer.',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the product object
                const publicacion = this.selectedPublicacionForm.getRawValue();

                // Delete the post on the server
                this._inventoryService.deletePublicacion(publicacion.idPublicacion).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    verifyLimtiPost(): void {
        this._detalleSubscripcionService.limitPost()
            .subscribe({

                next: (reponse) => {
                    if (reponse.banderaBol) {

                        this.openComposeDialog();
                    } else {
                        this.titleAlert = reponse.title;
                        this.bodyAlert = reponse.body;
                        this.banLimitPost = true;
                        this.cd.detectChanges();
                        setTimeout(() => {

                            this.banLimitPost = false; // Después de 3 segundos, restablece a false
                            this.cd.detectChanges();
                        }, 6000);
                    }
                },
                error: (error) => {

                }
            });
    }

    //ABRIR EL MODAL
    openComposeDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(ModalServicioComponent);

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
            });
    }
}