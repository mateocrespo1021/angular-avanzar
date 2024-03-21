import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDateFormats, MatOptionModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'settings-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, CommonModule, MatDatepickerModule],
})
export class SettingsAccountComponent implements OnInit {
  //Usuario logeado
  user: User;

  accountForm: UntypedFormGroup;
  selectedFile: File | null = null; // Variable para almacenar el archivo seleccionado

  @ViewChild('accountForm') signInNgForm: NgForm;

  usuario = JSON.parse(localStorage.getItem('user'));
  rol = localStorage.getItem('Rol');


  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };

  showAlert: boolean = false;
  selectedDate: Date | null = null;

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    // Formatea la fecha seleccionada en 'dd/MM/yyyy'
    const formattedDate = this.datePipe.transform(event.value, 'dd/MM/yyyy');

    // Actualiza el valor del control 'dateBirth' en el formulario
    this.accountForm.get('dateBirth').setValue(formattedDate);
  }

  paises = [
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


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _userService: UserService,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private confirmationService: FuseConfirmationService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the user service
    this._userService.user$
      .pipe((takeUntil(this._unsubscribeAll)))
      .subscribe((user: User) => {
        this.user = user;
      });


    // Create the form
    this.accountForm = this._formBuilder.group({
      Firstname: [this.user.persona.primer_nombre],
      Secondname: [this.user.persona.segundo_nombre],
      FirstSurname: [this.user.persona.primer_apellido],
      SecondSurname: [this.user.persona.segundo_apellido],
      rol: [this.rol],
      username: [this.user.name],
      email: [this.user.persona.correo],
      phone: [this.user.persona.celular],
      address: [this.user.persona.direccion],
      avatar: [this.user.avatar],
      description: [this.user.persona.descripcion],
      nationality: [this.user.persona.nacionalidad],
      genero: [this.user.persona.genero],
      dateBirth: [this.formatDate(this.user.persona.fecha_nacimiento)]

    });


  }



  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.accountForm.patchValue({
          avatar: reader.result, // Actualiza la URL de la imagen previa en el formulario
        });
      };
      reader.readAsDataURL(this.selectedFile);

    }
  }


  onSubmit() {

    this.showAlert = false;

    const usuarioId = this.usuario.id;
    const formattedDate = this.datePipe.transform(this.accountForm.get('dateBirth').value, 'dd/MM/yyyy');
    const usuarioActualizado = {
      persona: {
        primer_nombre: this.accountForm.value.Firstname,
        segundo_nombre: this.accountForm.value.Secondname,
        primer_apellido: this.accountForm.value.FirstSurname,
        segundo_apellido: this.accountForm.value.SecondSurname,
        correo: this.accountForm.value.email,
        celular: this.accountForm.value.phone,
        direccion: this.accountForm.value.address,
        nacionalidad: this.accountForm.value.nationality,
        genero: this.accountForm.value.genero,
        fecha_nacimiento: formattedDate,
        descripcion: this.accountForm.value.description
      },
      username: this.accountForm.value.email,
      name: this.accountForm.value.username,
      avatar: this.accountForm.value.avatar,
    };

    this._userService.actualizarUsuario(usuarioId, usuarioActualizado, this.selectedFile).subscribe(
      (response) => {
        const confirmationDialog = this.confirmationService.open({
          "title": "Éxito",
          "message": "Información Actualizada",
          "icon": {
            "show": true,
            "name": "heroicons_outline:check-circle",
            "color": "success"
          },
          "actions": {
            "confirm": {
              "show": false,
              "label": "Remove",
              "color": "warn"
            },
            "cancel": {
              "show": false,
              "label": "Cancel"
            }
          },
          "dismissible": true
        });
         this.renderer.setProperty(window,'location',location);
      },
      (error) => {

        console.error("error", error);

      }
    );
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


}
