import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ServicioModels, Servicios } from 'app/services/models/servicios';
import { ServiciosService } from 'app/services/services/servicios.service';
import Swal from 'sweetalert2';
import { ListRespServiciosComponent } from '../list-servicios/list-servicios.component';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { Publicacion, PublicacionA } from 'app/services/models/publicaciones';
import { Usuario } from 'app/services/models/usuario';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
    selector: 'mailbox-compose',
    templateUrl: './composeServicios.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    styleUrls: ['./composeServicios.component.scss'],

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
        { id: 1, value: 'Belleza', label: 'Belleza' },
        { id: 2, value: 'Costura', label: 'Costura' },
        { id: 3, value: 'Hogar', label: 'Hogar' },
    ];

    tipos = [
        { value: 'Productos', label: 'Productos' },
        { value: 'Servicios', label: 'Servicios' },
    ];

    estados = [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' },
    ];

    @Output() confirmacionCerrada: EventEmitter<boolean> = new EventEmitter<boolean>();

    publicacion: Publicacion;
    user: Usuario;
    servicio: ServicioModels;
    idPublicacion: any;
    idVendedor: any;
    categoriaExtraida: any;
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: UntypedFormBuilder,
        private servicioService: ServiciosService,
        private publicacionService: PublicacionesService,
        private _confirmationService: FuseConfirmationService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.publicacionService.buscarPublicacionId(ListRespServiciosComponent.idPublicacionSeleccionado).subscribe((data) => {
            this.publicacion = data;

            this.idVendedor = this.publicacion.vendedor.idVendedor;
            // Create the form
            this.composeForm = this._formBuilder.group({
                titulopubli: [this.publicacion.tituloPublicacion, Validators.required],
                descripcionpubli: [this.publicacion.descripcionPublicacion, Validators.required],
                nombreServicio: [this.publicacion.servicios.nombreServicio, Validators.required],
                vendedor: [this.publicacion.vendedor.usuario.name],
                categoria: [this.publicacion.servicios.categoriaServicio.idCategoriaServicio, Validators.required],
                tipo: [this.publicacion.categoria.nombreCategoria],
                precioInicialServicio: [this.publicacion.servicios.precioInicialServicio],
                precioFinalServicio: [this.publicacion.servicios.precioFinalServicio],
                precio: [this.publicacion.servicios.precioFijoServicio, Validators.required],
                cantidad: [this.publicacion.servicios.cantidadDisponible, Validators.required],
                tiempoServicio: [this.publicacion.servicios.tiempoServicio, Validators.required],
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
        /////cerrar
        //mensaje agregar
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
        this.ActualizarServicio();
    }*/

    isFormInvalid(): boolean {
        return this.composeForm.invalid || Object.values(this.composeForm.value).some((val) => val === '');
    }

    updateUser(): void {

        const selectedCategoryId = this.composeForm.value.nombreCategoria; // Obtiene la ID de la categoría seleccionada

        // Encuentra el nombre de la categoría correspondiente a la ID seleccionada
        const selectedCategory = this.categorias.find(categoria => categoria.id === selectedCategoryId);

        const servicio: Servicios = {

            nombreServicio: this.composeForm.value.nombreServicio,
            precioFijoServicio: this.composeForm.value.precio,
            precioInicialServicio: this.composeForm.value.precioInicialServicio,
            precioFinalServicio: this.composeForm.value.precioFinalServicio,
            cantidadDisponible: this.composeForm.value.cantidad,
            tiempoServicio: this.composeForm.value.tiempoServicio,
            categoriaServicio: {
                idCategoriaServicio: selectedCategoryId, // Asigna la ID de la categoría seleccionada
                nombreCategoria: selectedCategory ? selectedCategory.label : '', // Asigna el nombre de la categoría
            },
        };

        const publicacion: PublicacionA = {

            idPublicacion: this.publicacion.idPublicacion,
            tituloPublicacion: this.composeForm.value.titulopubli,
            descripcionPublicacion: this.composeForm.value.descripcionpubli,
            estado: this.composeForm.value.estado,
            visible: this.composeForm.value.estado,
            vendedor: {
                idVendedor: this.idVendedor, // Agrega el ID del vendedor al objeto producto
            },
        };



        const confirmationDialog = this._confirmationService.open({
            title: 'Confirmación',
            message: '¿Está seguro de modificarla publicación del servicio?',
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

                this.servicioService.actualizarServicio(this.publicacion.servicios.idServicio, servicio).subscribe((data) => {

                    this.publicacionService.updatePublicacionById(this.publicacion.idPublicacion, publicacion).subscribe((data) => {
                        this.matDialogRef.close();
                        this.confirmacionCerrada.emit(true);

                    });
                });


            } else {

            }
        });
    }

    /* ActualizarServicio(){
     this.servicioService.actualizarServicio(this.variableSer, this.servicio).subscribe((data)=>{
         Swal.fire(
            'Acción Exitosa',
            'Servicio Actualizado',
            'success'
                  );
        this.matDialogRef.close();
            }, error=>{
                console.log("Error al guardar");
            });
           }*/
}
