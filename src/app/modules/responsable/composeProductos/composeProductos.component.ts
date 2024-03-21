import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ProductosService } from 'app/services/services/producto.service';
import { CategoriesProd, Productos, ProductosModels } from 'app/services/models/productos';
import Swal from 'sweetalert2';
import { CategoriaPublicacion, Publicacion, PublicacionA } from 'app/services/models/publicaciones';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { Vendedor } from 'app/services/models/vendedora';
import { ListProductosResponsableComponent } from '../list-productos/list-productos.component';
import { CategoriaProducto } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { User } from 'app/core/user/user.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryService } from 'app/modules/emprendedora/ecommerce/inventory/inventory.service';
import { VendedorService } from 'app/services/services/vendedora.service';
import { Usuario } from 'app/services/models/usuario';
import { forkJoin } from 'rxjs';
import { CategoriaProductoService } from 'app/services/services/categoriaProducto.service';
@Component({
    selector: 'mailbox-compose',
    templateUrl: './composeProductos.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    styleUrls: ['./composeProductos.component.scss'],

    imports: [MatSelectModule, MatOptionModule, MatDatepickerModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
        MatInputModule, NgIf, QuillEditorComponent, CommonModule, MatNativeDateModule],
})
export class MailboxComposeComponent implements OnInit {
    composeForm: UntypedFormGroup;
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

    categorias = [
        { id: 1, value: 'Gastronomia', label: 'Gastronomia' },
        { id: 2, value: 'Vestimenta', label: 'Vestimenta' },
        { id: 3, value: 'Hogar', label: 'Hogar' },
        { id: 4, value: 'Manualidades', label: 'Manualidades' },
    ];

    tipos = [
        { value: 'Productos', label: 'Productos' },
        { value: 'Servicios', label: 'Servicios' },
    ];

    estados = [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' },
    ];

    publicacion: Publicacion;
    user: Usuario;
    producto: ProductosModels;
    idPublicacion: any;
    idVendedor: any;
    categoriaExtraida: any;

    @Output() confirmacionCerrada: EventEmitter<boolean> = new EventEmitter<boolean>();
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: FormBuilder,
        private productoService: ProductosService,
        private _confirmationService: FuseConfirmationService,
        private publicacionService: PublicacionesService,

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {


        this.publicacionService.buscarPublicacionId(ListProductosResponsableComponent.idPublicacionSeleccionado).subscribe((data) => {
            this.publicacion = data;

            this.idVendedor = this.publicacion.vendedor.idVendedor;
            // Create the form
            this.composeForm = this._formBuilder.group({
                tituloPublicacion: [this.publicacion.tituloPublicacion, Validators.required],
                descripcionPublicacion: [this.publicacion.descripcionPublicacion, Validators.required],
                nombreProducto: [this.publicacion.productos.nombreProducto, Validators.required],
                vendedor: [this.publicacion.vendedor.usuario.name],
                nombreCategoria: [this.publicacion.productos.categoriaProducto.idCategoriaProducto, Validators.required],
                tipo: [this.publicacion.categoria.nombreCategoria],
                precioInicialProducto: [this.publicacion.productos.precioInicialProducto],
                precioFinalProducto: [this.publicacion.productos.precioFinalProducto],
                precioProducto: [this.publicacion.productos.precioFijoProducto, Validators.required],
                cantidadDisponible: [this.publicacion.productos.cantidadDisponible, Validators.required],
                pesoProducto: [this.publicacion.productos.pesoProducto, Validators.required],
                estado: [this.publicacion.estado, Validators.required],
            });
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

    /**
     * Discard the message
     */
    discard(): void {
        this.matDialogRef.close();
    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void {
    }

    /**
     * Send the message
     */
    /*send(): void
    {
        this.ActualizarProducto();
    }*/

    isFormInvalid(): boolean {
        return this.composeForm.invalid || Object.values(this.composeForm.value).some((val) => val === '');
    }

    updateUser(): void {

        const selectedCategoryId = this.composeForm.value.nombreCategoria; // Obtiene la ID de la categoría seleccionada

        // Encuentra el nombre de la categoría correspondiente a la ID seleccionada
        const selectedCategory = this.categorias.find(categoria => categoria.id === selectedCategoryId);

        const producto: Productos = {

            nombreProducto: this.composeForm.value.nombreProducto,
            precioFijoProducto: this.composeForm.value.precioProducto,
            precioInicialProducto: this.composeForm.value.precioInicialProducto,
            precioFinalProducto: this.composeForm.value.precioFinalProducto,
            cantidadDisponible: this.composeForm.value.cantidadDisponible,
            pesoProducto: this.composeForm.value.pesoProducto,
            categoriaProducto: {
                idCategoriaProducto: selectedCategoryId, // Asigna la ID de la categoría seleccionada
                nombreCategoria: selectedCategory ? selectedCategory.label : '', // Asigna el nombre de la categoría
            },
        };

        const publicacion: PublicacionA = {

            idPublicacion: this.publicacion.idPublicacion,
            tituloPublicacion: this.composeForm.value.tituloPublicacion,
            descripcionPublicacion: this.composeForm.value.descripcionPublicacion,
            estado: this.composeForm.value.estado,
            visible: this.composeForm.value.estado,
            vendedor: {
                idVendedor: this.idVendedor, // Agrega el ID del vendedor al objeto producto
            },
        };



        const confirmationDialog = this._confirmationService.open({
            title: 'Confirmación',
            message: '¿Está seguro de modificar la publicación del producto?',
            icon: {
                show: true,
                name: 'heroicons_outline:information-circle',
                color: 'info',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Si, estoy seguro',
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

                this.productoService.actualizarProducto2(this.publicacion.productos.idProducto, producto).subscribe((data) => {

                    this.publicacionService.updatePublicacionById(this.publicacion.idPublicacion, publicacion).subscribe((data) => {
                        this.matDialogRef.close();
                        this.confirmacionCerrada.emit(true);

                    });
                });


            } else {

            }
        });
    }
    /*ActualizarProducto(){
     this.productoService.actualizarProducto2(this.variableProd, this.publicacion).subscribe((data)=>{
     Swal.fire(
     'Acción Exitosa',
     'Producto Actualizado',
     'success'
           );
 this.matDialogRef.close();
     }, error=>{
         console.log("Error al guardar");
     });
    }*/
}
