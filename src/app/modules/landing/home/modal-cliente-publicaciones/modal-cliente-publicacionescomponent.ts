import { Component, OnInit,EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
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
import { RouterLink } from '@angular/router';



@Component({
    selector: 'mailbox-compose',
    templateUrl: './modal-cliente-publicaciones.component.html',
    styleUrls: ['./modal-cliente-publicaciones.component.scss'],
    standalone: true,
    imports: [MatSlideToggleModule, MatSelectModule,FuseCardComponent,MatMenuModule,RouterLink, MatOptionModule, MatDatepickerModule, MatButtonModule, MatIconModule, FormsModule, MatFormFieldModule, MatInputModule,  QuillEditorComponent]

})
export class ModalPublicacionProductosComponent implements OnInit {


    constructor(
        public matDialogRef: MatDialogRef<ModalPublicacionProductosComponent>,
        private _formBuilder: FormBuilder,

    ) {
    }

    ngOnInit(): void {

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

}
