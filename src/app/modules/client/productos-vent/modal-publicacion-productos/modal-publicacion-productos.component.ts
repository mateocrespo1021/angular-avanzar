import { Component, OnInit, ChangeDetectorRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
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

import { Usuario } from 'app/services/models/usuario';
import { UserService } from 'app/core/user/user.service';
import { InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { PublicacionesInventory } from 'app/services/services/publicacionesInventory.service';
import { FuseCardComponent } from '@fuse/components/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { ProductosVentClientComponent } from '../productos-vent.component';
import { PublicacionesInventoryProductos } from 'app/services/services/PublicacionesInventory-Productos.service';



@Component({
    selector: 'mailbox-compose',
    templateUrl: './modal-publicacion-productos.component.html',
    styleUrls: ['./modal-publicacion-productos.component.scss'],
    standalone: true,
    imports: [NgOptimizedImage, MatSlideToggleModule, MatSelectModule, FuseCardComponent, MatMenuModule, RouterLink, MatOptionModule, MatDatepickerModule, NgFor, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent]

})
export class ModalPublicacionProductosComponent implements OnInit {
    selectedPublicacionForm: UntypedFormGroup;
    user: Usuario;
    selectedPublicacion: InventarioPublicaciones | null = null;
    flashMessage: 'success' | 'error' | null = null;
    @Output() confirmacionCerrada: EventEmitter<boolean> = new EventEmitter<boolean>();

    // ... otras propiedades ...

    constructor(
        public matDialogRef: MatDialogRef<ModalPublicacionProductosComponent>,
        private _formBuilder: FormBuilder,
        private _inventoryService: PublicacionesInventoryProductos,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
    }


    ngOnInit(): void {

        this._inventoryService.getPublicacionById(ProductosVentClientComponent.publicacionSeleccionada)
            .subscribe((product) => {
                this.selectedPublicacion = product;
                // Actualiza el FormGroup con los datos de la publicación
                this.selectedPublicacionForm = this._formBuilder.group({
                    idPublicacion: [this.selectedPublicacion.idPublicacion],
                    nombreProducto: [this.selectedPublicacion.productos.nombreProducto],
                    nombreCategoria: [this.selectedPublicacion.categoria.nombreCategoria],
                    tituloPublicacion: [this.selectedPublicacion.tituloPublicacion],
                    descripcionPublicacion: [this.selectedPublicacion.descripcionPublicacion],
                    descripcionUsuario: [this.selectedPublicacion.vendedor.usuario.persona.descripcion],
                    vendedor: [this.selectedPublicacion.vendedor.usuario.name],
                    emprendimiento: [this.selectedPublicacion.vendedor.nombreEmprendimiento],
                    cantidadDisponible: [this.selectedPublicacion.idPublicacion],
                    avatar: [this.selectedPublicacion.vendedor.usuario.avatar],
                    precioProducto: [this.selectedPublicacion.idPublicacion],
                    pais: [this.selectedPublicacion.vendedor.usuario.persona.nacionalidad],
                    email: [this.selectedPublicacion.vendedor.usuario.persona.correo],
                    contacto: [this.selectedPublicacion.vendedor.usuario.persona.celular],
                    genero: [this.selectedPublicacion.vendedor.usuario.persona.genero],
                    imagenes: [this.selectedPublicacion.imagenes],
                    currentImageIndex: 0,
                    estado: true,
                });

                this._changeDetectorRef.markForCheck();
            });

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
}
