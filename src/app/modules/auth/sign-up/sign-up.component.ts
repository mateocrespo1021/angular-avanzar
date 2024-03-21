import { DatePipe, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDateFormats } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { EmailDto } from 'app/services/models/emailDto';
import { Persona } from 'app/services/models/persona';
import { Usuario } from 'app/services/models/usuario';
import { EmailService } from 'app/services/services/email.service';
import { PersonaService } from 'app/services/services/persona.service';
import Swal from 'sweetalert2';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SYSTEM_NAME } from 'assets/resources/helperNombre';



@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule,
        MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
        MatDatepickerModule, MatSelectModule],
})
export class SignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alertCod: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    alertReg: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    showCode: boolean = false;
    //fechas
    selectedDate: Date;
    //intentos de verifición
    protected banVerificacion = 0;
    protected codeInt = "";
    protected codeRec = "";
    protected formCode = false;
    protected returnForm = false;
    //llamar componentes html para darle propiedades
    @ViewChild('btnCodeVerHtml') btnCodeVer: ElementRef;
    @ViewChild('inputCodeHmtl') inputCode: ElementRef;
    @ViewChild('cedulaField') cedulaField: ElementRef;
    @ViewChild('correoField') correoField: ElementRef;

    email: EmailDto = new EmailDto();
    persona: Persona = new Persona();
    user: User = new User();
    selectedFile: File | null = null;
    //Variable para el combo Box de genero que almacena el resultado
    public generoSeleccionado: string;

    cedulaRegistrada: boolean = false;
    correoRegistrado: boolean = false;
    //Nombre EvaMarket
    systemName = SYSTEM_NAME;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private personaService: PersonaService,
        private usuarioService: UserService,
        private emailService: EmailService,
        private confirmationService: FuseConfirmationService,
        private datePipe: DatePipe
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            cedula: ['', [Validators.required, validarLongitud()]],
            primernombre: ['', Validators.required],
            segundonombre: ['', Validators.required],
            primerapellido: ['', Validators.required],
            segundoapellido: ['', Validators.required],
            correo: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, validarcontra()]],
            direccion: ['', Validators.required],
            celular: ['', [Validators.required, validarLongitud()]],
            fecha_nacimiento: ['', [Validators.required, edadMinimaValidator()]],
            genero: ['', Validators.required],
            agreements: ['', Validators.requiredTrue],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    // Método para verificar si el formulario es válido y si se han aceptado los términos
    isFormValidAndAccepted(): boolean {
        return this.signUpForm.valid && this.signUpForm.get('agreements').value;
    }

    // Método para capturar la cédula del formulario

    capturarCedulaYBuscar(): void {
        const cedulaValue = this.signUpForm.get('cedula').value;
        const correoValue = this.signUpForm.get('correo').value;
        this.buscarPersonaPorCedula(cedulaValue);
    }

    // Método para buscar la cédula si esta en la BD

    buscarPersonaPorCedula(cedulaValue: string): void {
        this.personaService.buscarPersonaPorCedula(cedulaValue)
            .subscribe(
                (cedulaEncontrada: boolean) => {
                    if (cedulaEncontrada) {
                        this.cedulaRegistrada = true;
                        const correoValue = this.signUpForm.get('correo').value;
                        this.buscarPersonaPorCorreoYMostrarMensaje(cedulaValue, correoValue);
                    } else {
                        this.cedulaRegistrada = false;
                        const correoValue = this.signUpForm.get('correo').value;
                        this.buscarPersonaPorCorreo(correoValue);
                    }
                },
                (error) => {
                    console.error('Error al buscar persona:', error);
                }
            );
    }


    buscarPersonaPorCorreoYMostrarMensaje(cedulaValue: string, correoValue: string): void {
        this.personaService.buscarPersonaPorCorreo(correoValue)
            .subscribe(
                (correoEncontrado: boolean) => {
                    if (correoEncontrado) {
                        this.correoRegistrado = true;
                        const confirmationDialog = this.confirmationService.open({
                            title: 'Ocurrió un error',
                            message: `La cédula y correo ya han sido registrados`,
                            actions: {
                                confirm: {
                                    show: true,
                                    label: 'OK',
                                    color: 'primary'
                                },
                                cancel: {
                                    show: false,
                                    label: 'Cancelar'
                                }
                            }
                        });

                        confirmationDialog.afterClosed().subscribe(result => {
                            if (result === 'confirmed') {
                                this.cedulaField.nativeElement.focus();
                            }
                        });
                    } else {
                        this.correoRegistrado = false;
                        const confirmationDialog = this.confirmationService.open({
                            title: 'Ocurrió un error',
                            message: 'La cédula ' + cedulaValue + ' ya ha sido registrada',
                            actions: {
                                confirm: {
                                    show: true,
                                    label: 'OK',
                                    color: 'primary'
                                },
                                cancel: {
                                    show: false,
                                    label: 'Cancelar'
                                }
                            }
                        });

                        confirmationDialog.afterClosed().subscribe(result => {
                            if (result === 'confirmed') {
                                this.cedulaField.nativeElement.focus();
                            }
                        });
                    }
                },
                (error) => {
                    console.error('Error al buscar persona:', error);
                }
            );
    }

    // Método para buscar el correo si esta en la BD

    buscarPersonaPorCorreo(correoValue: string): void {
        this.personaService.buscarPersonaPorCorreo(correoValue)
            .subscribe(
                (encontrada: boolean) => {
                    if (encontrada) {
                        this.correoRegistrado = true;
                        const confirmationDialog = this.confirmationService.open({
                            title: 'Ocurrió un error',
                            message: 'El correo ' + correoValue + ' ya ha sido registrado',
                            actions: {
                                confirm: {
                                    show: true,
                                    label: 'OK',
                                    color: 'primary'
                                },
                                cancel: {
                                    show: false,
                                    label: 'Cancelar'
                                }
                            }
                        });

                        confirmationDialog.afterClosed().subscribe(result => {
                            if (result === 'confirmed') {
                                this.correoField.nativeElement.focus();
                            }
                        });
                    } else {
                        this.correoRegistrado = false;
                        this.formCode = true;
                        this.signUp();
                    }
                },
                (error) => {
                    console.error('Error al buscar persona:', error);
                }
            );
    }

    // Método para registrar a un nuevo usuario

    signUp(): void {
        this.persona.estado = true;
        this.persona.nacionalidad = "Ecuador"
        this.user.enabled = true;
        this.user.visible = true;
        this.user.username = this.signUpForm.get('correo')?.value;
        this.user.password = this.signUpForm.get('password')?.value;
        const primerNombre = this.signUpForm.get('primernombre')?.value;
        const primerApellido = this.signUpForm.get('primerapellido')?.value;
        const generoSeleccionado = this.signUpForm.get('genero').value
        const formattedDate = this.datePipe.transform(this.selectedDate, 'dd/MM/yyyy');
        this.persona.descripcion = "Hola mi nombre es " + primerNombre + ' ' + primerApellido + " encantado de conocerte. ♥";
        this.user.name = primerNombre + ' ' + primerApellido;
        this.persona.fecha_nacimiento = formattedDate;
        this.persona.genero = generoSeleccionado;



        this.banVerificacion = 0;
        this.email.subject = "Su código de verificación es:"
        this.email.to = this.persona.correo;
        this.showCode = false;
        //regresar al formulario
        this.returnForm = false;
        this.emailService.sendCodeVer(this.email)
            .subscribe({

                next: (reponse) => {

                    this.alertCod = {
                        type: 'success',
                        message: 'Código enviado revise en Spam o Recibidos',
                    };
                    this.codeRec = reponse.text;
                    this.showCode = true;
                    this.returnForm = true;
                },
                error: (error) => {
                    this.alertCod = {
                        type: 'error',
                        message: 'Ha ocurrido al enviar el código',
                    };
                    this.showCode = true;
                    this.returnForm = true;
                }
            });


    }


    upload(event: any) {
        const file = event.target.files[0];
        this.selectedFile = file;
        /* if (file) {
            const formData=new FormData();
            formData.append('file',file);

            this.usuarioService.uploadFile(formData)
            .subscribe(response=>{
                console.log('response',response);

            })
        } */
    }

    /* Metodo para verificafar el código de verificación*/
    protected CodeVer() {


        if (this.banVerificacion < 3) {

            if (this.codeInt !== "") {

                if (this.codeRec === this.codeInt) {
                    this.returnForm = false;
                    this.personaService.savePersona(this.persona)


                    this.personaService.savePersona(this.persona).subscribe(data => {
                        this.user.persona = data;
                        const rolId = 4; // ID del rol
                        this.usuarioService.registrarUsuarioConFoto(this.user, rolId, this.selectedFile)
                            .subscribe({
                                next: (response) => {

                                    this.alertReg = {
                                        type: 'success',
                                        message: 'Su registro se a realizado correctamente',
                                    };
                                    this.showAlert = true;
                                    setTimeout(function () {
                                        window.location.href = 'https://www.evamarket.ec/#/sign-in'; // URL a la que deseas redirigir
                                    }, 1500);
                                },
                                error: (error) => {
                                    this.alertReg = {
                                        type: 'error',
                                        message: 'Ha ocurrido un error al crear el usuario',
                                    };
                                    this.showAlert = true;
                                    this.returnForm = true;
                                }
                            });

                        this.signUpNgForm.resetForm();

                    })


                } else {
                    this.banVerificacion++;
                    this.inputCode.nativeElement.classList.remove('bg-red-400');
                    switch (this.banVerificacion) {

                        case 1:

                            this.btnCodeVer.nativeElement.textContent = "2 Intentos";

                            break;
                        case 2:

                            this.btnCodeVer.nativeElement.textContent = "1 Intento";

                            break;
                        case 3:
                            this.btnCodeVer.nativeElement.textContent = "Demasiados intentos";
                            this.btnCodeVer.nativeElement.classList.replace('bg-indigo-600', 'bg-red-400');
                            this.btnCodeVer.nativeElement.classList.replace('hover:bg-indigo-500', 'hover:bg-red-400');
                            this.inputCode.nativeElement.classList.add('bg-red-400');
                            break;

                    }
                }

            } else {

                this.inputCode.nativeElement.classList.add('bg-red-400');
            }

        }


    }


}

/* Metodo para validar la cedula y celular de 10 digitos*/

function validarLongitud(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const longitud = control.value as string;

        if (longitud && longitud.length !== 10) {
            return { longitudInvalida: true };
        }

        return null;
    };
}

/* Metodo para validar la contraseña de 8 digitos*/

function validarcontra(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const longitud = control.value as string;

        if (longitud && longitud.length !== 8) {
            return { longitudInvalida: true };
        }

        return null;
    };

}

/* Metodo para validar que el usuario sea mayor de edad*/

function calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    return edad;
}


export function edadMinimaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const fechaNacimiento = control.value;
        if (!fechaNacimiento) {
            return null;
        }

        const edad = calcularEdad(fechaNacimiento);

        if (edad < 18) {
            return { menorDeEdad: true };
        }

        return null;
    };
}

