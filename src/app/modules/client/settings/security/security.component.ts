import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { validacion } from 'app/services/models/validacion';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule,
        MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule],
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: FormGroup;
    @ViewChild('securityNgForm') securityNgForm: NgForm;
    showAlert: boolean = false;
    alertType: string = ''; // Puede ser 'error', 'success', u otro tipo
    alertMessage: string = '';
    vali: validacion = new validacion();
  
    //alertas pass
    showAlertPassEqu = false;
    showAlertPassSecu = false;
    showAlertPassUpda = false;
    showAlertCurrentPas = false;
    longPass = "";
    equPass = "";
  
    alertUpdaPass: { type: FuseAlertType; message: string } = {
      type: 'success',
      message: '',
    };
    alertCurrentPass: { type: FuseAlertType; message: string } = {
      type: 'error',
      message: '',
    };
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private userService: UserService /*private cd: ChangeDetectorRef*/
      ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        /*
        this.securityForm = this._formBuilder.group({
          currentPassword: ['', Validators.required],
          newPassword: ['', Validators.required]
        });*/

        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: ['', [Validators.required,  validarcontra()]],
            newPassword: ['', [Validators.required, validarcontra()]],
            repPassword: ['', [Validators.required, this.equalPass(),  validarcontra()]],
            twoStep: [true],
            askPasswordChange: [false],
        });
        //autoevaluar si coinciden las pass
        this.securityForm.get('newPassword').valueChanges.subscribe(() => {
            this.securityForm.get('repPassword').updateValueAndValidity();
        });


    }
    //comparar las contraseñas
    equalPass() {
        return (repPass: AbstractControl): ValidationErrors | null => {
            const repEquPass = repPass.value as string;

            if (repEquPass !== '') {
                if (repEquPass === this.securityForm.get('newPassword').value) {
                    this.showAlertPassEqu = true;
                    this.equPass = "Las contraseñas coinciden"
                    return null;
                } else {
                    this.showAlertPassEqu = true;
                    this.equPass = "Las contraseñas no coinciden"
                    return null;
                }

            } else {
                this.equPass = "";
                this.showAlertPassEqu = false;
                return null;
            }
        }


    }


    // evaluar longitud 
    testLongPass(): ValidatorFn {

        return (pass: AbstractControl): ValidationErrors | null => {
            const longitud = pass.value as string;
            this.showAlertPassSecu = false;
            if (longitud != null) {
                if (longitud.length >= 1 && longitud.length < 7) {

                    this.longPass = "Muy corta"
                    return { longInvalid: true };


                } else if (longitud.length > 15) {

                    this.longPass = "Muy larga"

                    return { longInvalid: true }

                } else if (longitud != "") {

                    this.longPass = this.vali.evaluarSeguridadContrasena(longitud);
                    this.showAlertPassSecu = true;


                    return null;
                }
            }
        }
    }



    isFormValid(): boolean {
        return this.securityForm.valid;
    }

    changePass(currentPass: string, newPass: string, repPass: string) {
        this.showAlertPassUpda = false;
        this.showAlertCurrentPas = false;
        if (newPass === repPass && repPass.length >= 7 && repPass.length < 15) {


            this.userService.actualizarContrasena(currentPass, newPass)
                .subscribe({
                    next: (response) => {

                        this.alertCurrentPass = {
                            type: 'success',
                            message: 'Contraseña modificada',
                        };

                        this.showAlertCurrentPas = true;
                        this.securityNgForm.resetForm();
                        /*this.cd.detectChanges();*/
                        this.showAlertPassEqu = false;
                    },
                    error: (error) => {

                        this.alertUpdaPass = {
                            type: 'error',
                            message: 'Contraseña anterior incorrecta',
                        };
                        this.showAlertPassUpda = true;
                        this.securityForm.get('repPassword').updateValueAndValidity();

                    }


                });


        }

    }

    
}

function validarcontra(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const longitud = control.value as string;

        if (longitud && longitud.length !== 8) {
            return { longitudInvalida: true };
        }

        return null;
    };

}
