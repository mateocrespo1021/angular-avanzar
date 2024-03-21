import { NgFor, NgIf } from '@angular/common';
import { Component, ChangeDetectorRef,ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import { Usuario } from 'app/services/models/usuario';
import { InventoryServiceServicios } from '../ecommerce copy/inventory/inventoryServicios.service';
import { VendedorService } from 'app/services/services/vendedora.service';
import { CategoriaProductoService } from 'app/services/services/categoriaProducto.service';
import { ServiciosService } from 'app/services/services/servicios.service';
import { CategoriaPublicacionService } from 'app/services/services/categoria.service';
import { CategoriaProducto, CategoriaServicio,CategoriaPublicacion, InventarioPublicaciones} from '../ecommerce copy/inventory/inventoryServicios.types';
import { Publicacion } from 'app/services/models/publicaciones';
import { ServicioModels } from 'app/services/models/servicios';
import { CategoriaServicioService } from 'app/services/services/categoriaServicio.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DetalleSubscripcionService } from 'app/services/services/detalleSubscripcion.service';
import {environment} from "../../../../environment";
@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './modal-servicio.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    styleUrls    : ['./modal-servicio.component.scss'],

    imports      : [MatSlideToggleModule,NgFor,MatSelectModule,MatOptionModule,MatDatepickerModule,MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent],
})
export class ModalServicioComponent implements OnInit
{
    selectedPublicacionServicioForm: UntypedFormGroup;
    copyFields: { cc: boolean; bcc: boolean } = {
        cc : false,
        bcc: false,
    };
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{align: []}, {list: 'ordered'}, {list: 'bullet'}],
            ['clean'],
        ],
    };

    categoriesPublicacion: CategoriaPublicacion[];
    categoriesServicio: CategoriaServicio[];
    user: Usuario;
    publication = new Publicacion();
    servicio=new ServicioModels();
    idPublicacion: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    flashMessage: 'success' | 'error' | null = null;

    uploadedPhotos: File[] = [];
    imagePreviews: string[] = [];

    banLimitPost = false;
    titleAlert="";
    bodyAlert="";
    onFileSelected(event: any) {
        const files: FileList = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.uploadedPhotos.push(file);
            // Mostrar la vista previa de la imagen
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreviews.push(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    removePhoto(index: number) {
        this.uploadedPhotos.splice(index, 1);
        this.imagePreviews.splice(index, 1);
    }

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<ModalServicioComponent>,
        private _formBuilder: UntypedFormBuilder,
        private renderer: Renderer2,
        private el: ElementRef,
        private _userService: UserService,
        private _inventoryService: InventoryServiceServicios,
        private _vendedoraService: VendedorService,
        private _categoriaServicioService: CategoriaServicioService,
        private _servicioService:ServiciosService,
        private _categoriaService: CategoriaPublicacionService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _detalleSubscripcionService: DetalleSubscripcionService,


    )
    {
    }


    onDragOver(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.renderer.addClass(this.el.nativeElement.querySelector('.border-dashed'), 'border-blue-500');
    }

    onDragLeave(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.renderer.removeClass(this.el.nativeElement.querySelector('.border-dashed'), 'border-blue-500');
    }

    onDrop(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.renderer.removeClass(this.el.nativeElement.querySelector('.border-dashed'), 'border-blue-500');
        const files = event.dataTransfer.files;
        this.onFileSelected(files);

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

         //Metodo para extraer datos del usuario logeado
         this._userService.user$
         .pipe((takeUntil(this._unsubscribeAll)))
         .subscribe((user: Usuario) => {
             this.user = user;
         });

        // Create the form
        this.selectedPublicacionServicioForm = this._formBuilder.group({
            idPublicacion: [''],
            categoria: ['',Validators.required],
            nombreServicio: ['', [Validators.required]],
            tituloPublicacion: ['', [Validators.required]],
            descripcionPublicacion: [''],
            tipos: ['',Validators.required],
            vendedor: [this.user.name],
            cantidadDisponible: ['', [this.positiveIntegerValidator]],
            precioInicialServicio: ['',[this.positiveNumberValidator]],
            precioFinalServicio: ['',[this.positiveNumberValidator]],
            precioFijoServicio: ['', [Validators.required,this.positiveNumberValidator]],
            tiempoServicio:  ['',[this.positiveNumberValidator]],
            miniaturaServicio: [''],
            imagenes: [[]],
            currentImageIndex: [0], // Índice de la imagen que se está visualizando
            estado: [false],
        });
        this.selectedPublicacionServicioForm.get('estado').disable();
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



    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the copy field with the given field name
     *
     * @param name
     */
    showCopyField(name: string): void
    {
        // Return if the name is not one of the available names
        if ( name !== 'cc' && name !== 'bcc' )
        {
            return;
        }

        // Show the field
        this.copyFields[name] = true;
    }

    /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }


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
        }, 8000);
    }

    /**
     * Discard the message
     */
    discard(): void
    {
        this.matDialogRef.close();
    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {
    }

    verifyLimtiPost(): void {

        if ( this.selectedPublicacionServicioForm.invalid )
        {
            return;
        }

        this._detalleSubscripcionService.limitPost()
            .subscribe({

                next: (reponse) => {
                    if (reponse.banderaBol) {

                        this.send();
                    } else {
                        this.titleAlert=reponse.title;
                        this.bodyAlert=reponse.body;
                        this.banLimitPost = true;

                        setTimeout(() => {

                            this.banLimitPost = false; // Después de 3 segundos, restablece a false

                        }, 6000);
                    }
                },
                error: (error) => {

                }
            });
    }

    /**
     * Send the message
     */
    send(): void {



        this.selectedPublicacionServicioForm.disable();

        const post = this.selectedPublicacionServicioForm.getRawValue();
        const vendedor$ = this._vendedoraService.buscarVendedoraId(this.user.id);
        const categoria$ = this._categoriaService.buscarCategoriaId(post.tipos);
        const categoriaServicio$ = this._categoriaServicioService.getCategoriaServicio(post.categoria);

        // Fecha actual
        const fecha = new Date().toISOString();

        // Lista de imágenes predefinidas vacía
        const imagenesSeleccionadas: File[] = [];

        if (this.uploadedPhotos.length > 0) {
            imagenesSeleccionadas.push(...this.uploadedPhotos);
            const primeraImagen = imagenesSeleccionadas[0];
            const baseUrl = environment.baseUrlm;
            const urlCompleta = `${baseUrl}/api/publicaciones/${primeraImagen.name}`;
            this.servicio.miniaturaServicio = urlCompleta;
        }

        forkJoin([vendedor$, categoriaServicio$, categoria$]).subscribe(([vendedor, categoriaServicio, categoria]) => {
            this.publication.vendedor = vendedor;
            this.publication.categoria = categoria;
            this.publication.tituloPublicacion = post.tituloPublicacion;
            this.publication.descripcionPublicacion = post.descripcionPublicacion;
            this.publication.estado = post.estado;
            this.publication.visible = true;
            this.publication.fechaPublicacion = new Date(fecha);

            // Atributos de servicio
            this.servicio.cantidadDisponible = post.cantidadDisponible;
            this.servicio.tiempoServicio = post.tiempoServicio;
            this.servicio.precioInicialServicio = post.precioInicialServicio;
            this.servicio.precioFinalServicio = post.precioFinalServicio;
            this.servicio.precioFijoServicio = post.precioFijoServicio;
            this.servicio.nombreServicio = post.nombreServicio;
            this.servicio.categoriaServicio = categoriaServicio;
            this.servicio.descripcionServicio = post.descripcionPublicacion;
            this.servicio.estado = true;


            // Llamar al servicio para guardar el producto
            this._servicioService.saveServicio(this.servicio).subscribe((data) => {
                this.publication.servicios = data;

                // Llamar al servicio para crear la publicación con las imágenes
                this._inventoryService.createPublicacion(this.publication, imagenesSeleccionadas).subscribe((newPublicacion) => {
                    //this.publication = newPublicacion;
                    this.showFlashMessage('success');
                    this.selectedPublicacionServicioForm.enable();
                    this.selectedPublicacionServicioForm.get('estado').disable();
                });
            });


        });
    }

    //Método para validar solo stock numeros enteros

    positiveIntegerValidator(control) {
        const value = control.value;
        if (!Number.isInteger(value) || value < 0) {
            return { positiveInteger: true };
        }
        return null;
    }

    //Método para validar solo peso numeros positivos

    positiveNumberValidator(control) {
        const value = control.value;
        if (isNaN(value) || value < 0) {
            return { positiveNumber: true };
        }
        return null;
    }
}
