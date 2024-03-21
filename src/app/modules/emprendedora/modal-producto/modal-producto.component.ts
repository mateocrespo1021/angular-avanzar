import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, ElementRef, Component, OnInit, Renderer2, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { CategoriaProducto, CategoriaPublicacion, InventarioPublicaciones } from '../ecommerce/inventory/inventory.types';
import { InventoryService } from '../ecommerce/inventory/inventory.service';
import { Subject, takeUntil, forkJoin, Observable } from 'rxjs';
import { Usuario } from 'app/services/models/usuario';
import { UserService } from 'app/core/user/user.service';
import { VendedorService } from 'app/services/services/vendedora.service';
import { Publicacion } from 'app/services/models/publicaciones';
import { CategoriaProductoService } from 'app/services/services/categoriaProducto.service';
import { ProductosModels } from 'app/services/models/productos';
import { ProductosService } from 'app/services/services/producto.service';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { CategoriaPublicacionService } from 'app/services/services/categoria.service';
import { DetalleSubscripcionService } from 'app/services/services/detalleSubscripcion.service';
import {environment} from "../../../../environment";
@Component({
    selector: 'mailbox-compose',
    templateUrl: './modal-producto.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    styleUrls: ['./modal-producto.component.scss'],

    imports: [MatSlideToggleModule, MatSelectModule,NgFor, MatOptionModule, MatDatepickerModule, NgFor, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent],
})
export class ModalProductoComponent implements OnInit {
    selectedPublicacionForm: UntypedFormGroup;
    copyFields: { cc: boolean; bcc: boolean } = {
        cc: false,
        bcc: false,
    };
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
        ],
    };
    @ViewChild('modalProductoNgForm') modalProductoNgForm: NgForm;


    //Extraer las categorias de los productos
    categoriesProducto: CategoriaProducto[];
    categoriesPublicacion: CategoriaPublicacion[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    flashMessage: 'success' | 'error' | null = null;
    user: Usuario;
    publication = new Publicacion();
    idPublicacion: any;
    producto = new ProductosModels();
    selectedPublicacion: InventarioPublicaciones | null = null;

    uploadedPhotos: File[] = [];
    imagePreviews: string[] = [];

    banLimitPost = false;
    titleAlert = "";
    bodyAlert = "";
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
        public matDialogRef: MatDialogRef<ModalProductoComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _inventoryService: InventoryService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _vendedoraService: VendedorService,
        private _categoriaProductoService: CategoriaProductoService,
        private _productoService: ProductosService,
        private _categoriaService: CategoriaPublicacionService,
        private el: ElementRef,
        private renderer: Renderer2,
        private _detalleSubscripcionService: DetalleSubscripcionService,


    ) {
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
    ngOnInit(): void {
        //Metodo para extraer datos del usuario logeado
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: Usuario) => {
                this.user = user;
            });

        // Create the form
        this.selectedPublicacionForm = this._formBuilder.group({
            idPublicacion: [''],
            categoria: ['', Validators.required],
            nombreProducto: ['', [Validators.required]],
            tituloPublicacion: ['', [Validators.required]],
            descripcionPublicacion: [''],
            tipos: ['', Validators.required],
            vendedor: [this.user.name],
            cantidadDisponible: ['', [this.positiveIntegerValidator]],
            precioInicialProducto: ['',[this.positiveNumberValidator]],
            precioFinalProducto: ['', [this.positiveNumberValidator]],
            precioFijoProducto: ['', [Validators.required,this.positiveNumberValidator]],
            pesoProducto: ['', [this.positiveNumberValidator]],
            miniaturaProducto: [''],
            imagenes: [[]],
            currentImageIndex: [0], // Índice de la imagen que se está visualizando
            estado: [false],
        });
        this.selectedPublicacionForm.get('estado').disable();
        // Get the categoriesProduct
        this._inventoryService.categoriesProducto$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: CategoriaProducto[]) => {
                // Update the categories
                this.categoriesProducto = categories;

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
    showCopyField(name: string): void {
        // Return if the name is not one of the available names
        if (name !== 'cc' && name !== 'bcc') {
            return;
        }

        // Show the field
        this.copyFields[name] = true;
    }

    /**
     * Save and close
     */
    saveAndClose(): void {
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
    discard(): void {
        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void {
    }
    verifyLimtiPost(): void {

        if (this.selectedPublicacionForm.invalid) {
            return;
        }

        this._detalleSubscripcionService.limitPost()
            .subscribe({

                next: (reponse) => {
                    if (reponse.banderaBol) {

                        this.send();
                    } else {
                        this.titleAlert = reponse.title;
                        this.bodyAlert = reponse.body;
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



        this.selectedPublicacionForm.disable();

        const post = this.selectedPublicacionForm.getRawValue();
        const vendedor$ = this._vendedoraService.buscarVendedoraId(this.user.id);
        const categoria$ = this._categoriaService.buscarCategoriaId(post.tipos);
        const categoriaProducto$ = this._categoriaProductoService.getCategoriaProducto(post.categoria);

        // Fecha actual
        const fecha = new Date().toISOString();

        // Lista de imágenes predefinidas vacía
        const imagenesSeleccionadas: File[] = [];

        if (this.uploadedPhotos.length > 0) {
            imagenesSeleccionadas.push(...this.uploadedPhotos);
            const primeraImagen = imagenesSeleccionadas[0];
            const baseUrl = environment.baseUrlm;
            const urlCompleta = `${baseUrl}/api/publicaciones/${primeraImagen.name}`;
            this.producto.miniaturaProducto = urlCompleta;
        }

        forkJoin([vendedor$, categoriaProducto$, categoria$]).subscribe(([vendedor, categoriaProducto, categoria]) => {
            this.publication.vendedor = vendedor;
            this.publication.categoria = categoria;
            this.publication.tituloPublicacion = post.tituloPublicacion;
            this.publication.descripcionPublicacion = post.descripcionPublicacion;
            this.publication.estado = post.estado;
            this.publication.visible = true;
            this.publication.fechaPublicacion = new Date(fecha);

            // Atributos de producto
            this.producto.cantidadDisponible = post.cantidadDisponible;
            this.producto.pesoProducto = post.pesoProducto;
            this.producto.precioInicialProducto = post.precioInicialProducto;
            this.producto.precioFinalProducto = post.precioFinalProducto;
            this.producto.precioFijoProducto = post.precioFijoProducto;
            this.producto.nombreProducto = post.nombreProducto;
            this.producto.categoriaProducto = categoriaProducto;
            this.producto.descripcionProducto = post.descripcionPublicacion;
            this.producto.estadoProducto = true;

            // Llamar al servicio para guardar el producto
            this._productoService.saveProducto(this.producto).subscribe((data) => {
                this.publication.productos = data;


                // Llamar al servicio para crear la publicación con las imágenes
                this._inventoryService.createPublicacion(this.publication, imagenesSeleccionadas).subscribe((newPublicacion) => {
                    //this.publication = newPublicacion;
                    this.showFlashMessage('success');
                    this.selectedPublicacionForm.enable();
                    this.selectedPublicacionForm.get('estado').disable();
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
