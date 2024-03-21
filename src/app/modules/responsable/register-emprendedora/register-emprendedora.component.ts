import { DetalleSubscripcion } from './../../../services/models/detalleSubscripcion';
import { user } from './../../../mock-api/common/user/data';
import { FuseAlertType } from './../../../../@fuse/components/alert/alert.types';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PersonaService } from 'app/services/services/persona.service';
import { UserService } from 'app/core/user/user.service';
import { Persona } from 'app/services/models/persona';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { User } from 'app/core/user/user.types';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { FuseCardComponent } from '@fuse/components/card';
import { VendedorService } from 'app/services/services/vendedora.service';
import { Vendedor } from 'app/services/models/vendedora';
import Swal from 'sweetalert2';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from '@angular/router';
import { DetalleSubscripcionService } from 'app/services/services/detalleSubscripcion.service';


@Component({
    selector: 'register-emprendedora',
    templateUrl: './register-emprendedora.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule,
        MatButtonModule, MatCheckboxModule, MatRadioModule, MatTableModule, MatTabsModule, MatDatepickerModule,
        NgIf, FuseAlertComponent, NgClass, FuseCardComponent],
})
export class RegisterEmpreRespComponent implements OnInit {

    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    @ViewChild('cedulaField') cedulaField: ElementRef;
    @ViewChild('correoField') correoField: ElementRef;
    @ViewChild('horizontalStepper') horizontalStepper: MatStepper;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    

    showAlert: boolean = false;

    horizontalStepperForm: FormGroup;
    persona: Persona = new Persona();
    vendedor: Vendedor = new Vendedor();
    detalleMembresia: DetalleSubscripcion = new DetalleSubscripcion();
    selectedDate: Date;
    selectedFile: File | null = null;
    user: User = new User();
    yearlyBilling: boolean = true;
    clickedButtonValue: number = 1; // Inicializar con 1
    selectedImageSrc: string = null;

    cedulaRegistrada: boolean = false;
    correoRegistrado: boolean = false;
    canProceedToNextStep = true;

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder,
        private personaService: PersonaService,
        private usuarioService: UserService,
        private datePipe: DatePipe,
        private router: Router,
        private confirmationService: FuseConfirmationService,
        private vendedorService: VendedorService,
        private detalleSubscripcion: DetalleSubscripcionService
    ) {


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                cedula: ['', [Validators.required, validarLongitud()]],
                primerNombre: ['', Validators.required],
               // segundoNombre: ['', Validators.required],
                primerApellido: ['', Validators.required],
               // segundoApellido: ['', Validators.required],
                correo: ['', [Validators.required, Validators.email]],
               // direccion: ['', Validators.required],
                celular: ['', [Validators.required, validarLongitud()]],
                //fechaNacimiento: ['', [Validators.required, edadMinimaValidator()]],
                //genero: ['', Validators.required],
               // nacionalidad: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                usuario: ['', Validators.required],
                email: ['', Validators.required],
                password: ['', [Validators.required, validarcontra()]],
                avatar: [''],
                descripcion: [''],
                nombreEmprendimiento:['',[Validators.required]]
            }),
            step3: this._formBuilder.group({
                rolUser: ['Responsable', Validators.required],
            }),
        });


        // Listen to changes in the 'correo' field in step1
        this.horizontalStepperForm
            .get('step1.correo')
            .valueChanges.subscribe((correoValue) => {
                // Set the value of 'email' in step2 to the same value as 'correo'
                this.horizontalStepperForm.get('step2.email').setValue(correoValue);
            });

        this.horizontalStepperForm.valueChanges.subscribe((formValues) => {
            const primerNombreValue = formValues.step1.primerNombre;
            const primerApellidoValue = formValues.step1.primerApellido;

            const usuarioValue = primerNombreValue + ' ' + primerApellidoValue;

            // Verifica si el valor actual es diferente antes de establecerlo
            const currentUsuarioValue = this.horizontalStepperForm.get('step2.usuario').value;
            if (currentUsuarioValue !== usuarioValue) {
                this.horizontalStepperForm.get('step2.usuario').setValue(usuarioValue);
            }
        });



    }

    // Método para capturar la cédula del formulario

    
    capturarCedulaYBuscar(): void {
        const cedulaValue = this.horizontalStepperForm.get('step1.cedula').value;
        const correoValue = this.horizontalStepperForm.get('step1.correo').value;
        this.buscarPersonaPorCedula(cedulaValue);
        
        this.mostrarAlertaPlanGratis();
    }
    
    //alerta del plan gratis
    mostrarAlertaPlanGratis(): void {
        Swal.fire({
          icon: 'info',
          title: 'El plan por defecto es gratis',
          showConfirmButton: true,
          confirmButtonText: 'Cerrar'
        });
    }
    
    
    // Método para buscar la cédula si esta en la BD

    buscarPersonaPorCedula(cedulaValue: string): void {
        this.personaService.buscarPersonaPorCedula(cedulaValue)
            .subscribe(
                (cedulaEncontrada: boolean) => {
                    if (cedulaEncontrada) {
                        this.cedulaRegistrada = true;
                        const correoValue = this.horizontalStepperForm.get('step1.correo').value;
                        this.buscarPersonaPorCorreoYMostrarMensaje(cedulaValue, correoValue);
                    } else {
                        this.cedulaRegistrada = false;
                        const correoValue = this.horizontalStepperForm.get('step1.correo').value;
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
                        this.canProceedToNextStep = false;
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
                        this.canProceedToNextStep = false;
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
                        this.canProceedToNextStep = false;
                    } else {
                        this.correoRegistrado = false;
                        this.canProceedToNextStep = true;
                        if (this.canProceedToNextStep) {
                            this.horizontalStepper.next(); // Avanzar al siguiente paso
                        }
                    }
                },
                (error) => {
                    console.error('Error al buscar persona:', error);
                }
            );
    }

    registrarPersona(): void {
        // Obtén los valores de los FormControls del FormGroup
        const cedula = this.horizontalStepperForm.get('step1.cedula')?.value ?? '';
        const primerNombre = this.horizontalStepperForm.get('step1.primerNombre')?.value ?? '';
        const segundoNombre = this.horizontalStepperForm.get('step1.segundoNombre')?.value ?? '';
        const primerApellido = this.horizontalStepperForm.get('step1.primerApellido')?.value ?? '';
        const segundoApellido = this.horizontalStepperForm.get('step1.segundoApellido')?.value ?? '';
        const genero = this.horizontalStepperForm.get('step1.genero')?.value ?? '';
        const correoElectronico = this.horizontalStepperForm.get('step1.correo')?.value;
        const direccion = this.horizontalStepperForm.get('step1.direccion')?.value ?? '';
        const celular = this.horizontalStepperForm.get('step1.celular')?.value ?? '';
        const nacionalidad = this.horizontalStepperForm.get('step1.nacionalidad')?.value ?? '';
        const fechaActual = new Date();
        // const formattedDate = this.datePipe.transform(this.selectedDate, 'dd/MM/yyyy');
        const formattedDate = this.datePipe.transform(fechaActual, 'dd/MM/yyyy');
        const descripcion = this.horizontalStepperForm.get('step2.descripcion')?.value ?? '';

        // DATOS USUARIO
        const name = this.horizontalStepperForm.get('step2.usuario')?.value ?? '';
        const username = this.horizontalStepperForm.get('step2.email')?.value;
     //   const password = this.horizontalStepperForm.get('step2.password')?.value;
        const password=this.horizontalStepperForm.get('step1.cedula')?.value;
        const avatar = this.horizontalStepperForm.get('step2.avatar')?.value ?? '';
        const emprendimiento=this.horizontalStepperForm.get('step2.nombreEmprendimiento')?.value ?? '';

        // ... otros campos ...

        this.persona.cedula = cedula;
        this.persona.primer_nombre = primerNombre;
        this.persona.segundo_nombre = segundoNombre;
        this.persona.primer_apellido = primerApellido;
        this.persona.segundo_apellido = segundoApellido;
        this.persona.fecha_nacimiento = formattedDate;
        this.persona.genero = genero;
        this.persona.correo = correoElectronico;
        this.persona.direccion = direccion;
        this.persona.celular = celular;
        this.persona.nacionalidad = nacionalidad;
        this.persona.descripcion = descripcion;
        this.persona.estado = true;


        // DATOS USUARIO

        this.user.name = primerNombre + ' ' + primerApellido;
        this.user.username = username;
        this.user.password = password;
        this.user.avatar = avatar;
        this.user.enabled = true;
        this.user.visible = true;

        //DATOS DE VENDEDOR
        this.vendedor.nombreEmprendimiento = emprendimiento;

        // ... otros campos ...

        // Luego, realiza la llamada al servicio para guardar la persona y el usuario
        // ... código para guardar persona y usuario ...
        this.personaService.savePersona(this.persona).subscribe(data => {
            this.user.persona = data;
            const rolId = 3; // ID del rol
            this.usuarioService.registrarUsuarioConFoto(this.user, rolId, this.selectedFile)
                .subscribe(
                    (response) => {
                        this.vendedor.usuario = response;
                        this.vendedorService.registrarVendedor(this.vendedor, this.clickedButtonValue).subscribe(dataVendedora => {
                            this.detalleMembresia.vendedor = dataVendedora;
                            const confirmationDialog = this.confirmationService.open({
                                title: 'Éxito',
                                message: 'Registro de emprendedora exitosa',
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:check-circle',
                                    color: 'success',
                                },
                                actions: {
                                    confirm: {
                                        show: true,
                                        label: 'Ver lista',
                                        color: 'primary'
                                    },
                                    cancel: {
                                        show: true,
                                        label: 'Registrar nuevo'
                                    }
                                }
                            });

                            confirmationDialog.afterClosed().subscribe(result => {
                                if (result === 'confirmed') {
                                    this.router.navigate(['/list-empre-resp']);
                                } else {
                                    this.horizontalStepper.reset();
                                }
                            });
                        },
                            (error) => {
                                this.alert = {
                                    type: 'error',
                                    message: 'Ha ocurrido un error al crear el usuario',
                                };
                                this.showAlert = true;
                                setTimeout(() => {
                                    this.showAlert = false; // Ocultar la alerta después de 4 segundos
                                }, 4000);
                            });

                    },

                );

        })

        // Restablece el formulario después de guardar los datos
    }

    upload(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;

            // Crear una URL de objeto para la imagen y asignarla a selectedImageSrc
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImageSrc = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    alerta(): void {
        this.alert = {
            type: 'success',
            message: 'Su registro se ha realizado correctamente',
        };
        this.showAlert = true;

        setTimeout(() => {
            this.showAlert = false; // Ocultar la alerta después de 4 segundos
        }, 4000); // 4000 milisegundos = 4 segundos
    }

    handleClick(buttonValue: number) {
        this.clickedButtonValue = buttonValue;
        if (buttonValue === 1) {

            const confirmationDialog = this.confirmationService.open({
                title: 'Éxito',
                message: 'Seleccionado Plan Gratuito',
                icon: {
                    show: true,
                    name: 'heroicons_outline:check-circle',
                    color: 'success',
                },
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

        } else if (buttonValue === 2) {

            const confirmationDialog = this.confirmationService.open({
                title: 'Éxito',
                message: 'Seleccionado Plan Premium',
                icon: {
                    show: true,
                    name: 'heroicons_outline:check-circle',
                    color: 'success',
                },
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

        } else if (buttonValue === 3) {

            const confirmationDialog = this.confirmationService.open({
                title: 'Éxito',
                message: 'Seleccionado Plan Gold',
                icon: {
                    show: true,
                    name: 'heroicons_outline:check-circle',
                    color: 'success',
                },
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