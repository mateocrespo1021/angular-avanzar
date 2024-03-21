import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { ListResponsableComponent } from '../list-responsables/list-responsables.component';
import { User } from 'app/core/user/user.types';
import { Usuario } from 'app/services/models/usuario';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Persona } from 'app/services/models/persona';
import { PersonaService } from 'app/services/services/persona.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from '@angular/router';
@Component({
  selector: 'mailbox-compose',
  templateUrl: './compose.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  styleUrls: ['./compose.component.scss'],

  imports: [MatSelectModule, MatOptionModule, MatDatepickerModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, NgIf, QuillEditorComponent, CommonModule, MatNativeDateModule],
})
export class MailboxComposeComponent implements OnInit {

  composeForm: UntypedFormGroup;
  @ViewChild('picker1') picker1: MatDatepicker<Date>;

  @Output() confirmacionCerrada: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  estados = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];

  generos = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
    { value: 'Otro', label: 'Otro ..' },
  ];

  nacionalidades = [
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Perú', label: 'Perú' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Venezuela', label: 'Venezuela' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Brasil', label: 'Brasil' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Bolivia', label: 'Bolivia' },
    { value: 'México', label: 'México' },
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Canadá', label: 'Canadá' },
    { value: 'España', label: 'España' },
    { value: 'Otro', label: 'Otro ...' },
  ];

  user: User;
  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<MailboxComposeComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private datePipe: DatePipe,
    private _personaService: PersonaService,
    private _confirmationService: FuseConfirmationService,
    private router: Router

  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._userService.buscarUserId(ListResponsableComponent.idUsuarioSeleccionado).subscribe((data) => {
      this.user = data;
      // Create the form inside the subscription
      this.composeForm = this._formBuilder.group({
        cedula: [this.user.persona.cedula, [Validators.required, validarLongitud()]],
        primer_nombre: [this.user.persona.primer_nombre, Validators.required],
        segundo_nombre: [this.user.persona.segundo_nombre, Validators.required],
        primer_apellido: [this.user.persona.primer_apellido, Validators.required],
        segundo_apellido: [this.user.persona.segundo_apellido, Validators.required],
        correo: [this.user.persona.correo, [Validators.required, Validators.email]],
        celular: [this.user.persona.celular, [Validators.required, validarLongitud()]],
        direccion: [this.user.persona.direccion, Validators.required],
        estado: [this.user.enabled, Validators.required],
        genero: [this.user.persona.genero, Validators.required],
        nacionalidad: [this.user.persona.nacionalidad, Validators.required],
        fecha_nacimiento: [this.formatDate(this.user.persona.fecha_nacimiento)],
        // Agrega otros campos del formulario aquí
      });

    });


  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  isFormInvalid(): boolean {
    return this.composeForm.invalid || Object.values(this.composeForm.value).some((val) => val === '');
  }

  updateUser(): void {

    const persona: Persona = {

      cedula: this.composeForm.value.cedula,
      primer_nombre: this.composeForm.value.primer_nombre,
      segundo_nombre: this.composeForm.value.segundo_nombre,
      primer_apellido: this.composeForm.value.primer_apellido,
      segundo_apellido: this.composeForm.value.segundo_apellido,
      genero: this.composeForm.value.genero,
      descripcion: this.user.persona.descripcion,
      nacionalidad: this.composeForm.value.nacionalidad,
      correo: this.composeForm.value.correo,
      direccion: this.composeForm.value.direccion,
      celular: this.composeForm.value.celular,
      estado: this.user.persona.estado,
      fecha_nacimiento: this.user.persona.fecha_nacimiento,

    };

    const usuario: User = {
      id: this.user.id,
      enabled: this.composeForm.value.estado,
      name: this.composeForm.value.primer_nombre + ' ' + this.composeForm.value.primer_apellido,
      visible: this.composeForm.value.estado,
      username: this.composeForm.value.correo,
      password: this.user.password
    };



    const confirmationDialog = this._confirmationService.open({
      title: 'Confirmación',
      message: '¿Está seguro de modificar el usuario?',
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

        this._personaService.updatePersonaById(this.user.persona.id_persona, persona).subscribe((data) => {

          usuario.name = this.composeForm.value.primer_nombre + ' ' + this.composeForm.value.primer_apellido;
          usuario.username = this.composeForm.value.correo;
          this._userService.updateUserById(this.user.id, usuario).subscribe((data) => {
            this.matDialogRef.close();
            this.confirmacionCerrada.emit(true);

          });
        });


      } else {

      }
    });





  }


  formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    const monthsInSpanish = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'Octuber', 'November', 'December'
    ];

    const monthName = monthsInSpanish[parseInt(month) - 1];

    return `${monthName} ${day}, ${year}`;
  }

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
  }

  /**
   * Save the message as a draft
   */
  saveAsDraft(): void {
  }

  /**
   * Send the message
   */
  send(): void {
  }
}

function validarLongitud(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const longitud = control.value as string;

    if (longitud && longitud.length !== 10) {
      return { longitudInvalida: true };
    }

    return null;
  };
}
