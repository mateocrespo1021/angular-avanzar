import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UsuarioRolService } from 'app/services/services/usuarioRol.service';
import { SYSTEM_NAME } from 'assets/resources/helperNombre';
import { Subject } from 'rxjs';


@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, 
      MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})

export class SingInComponent implements OnInit {

    //Variable para almacenar el nombre del rol del usuario que intenta ingresar al sistema
    rolUsuario:string;
    ROLINGRESADO: string = '';
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    //Nombre EvaMarket
    systemName=SYSTEM_NAME;


    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _userRol: UsuarioRolService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,

    ) {

    }

    ngOnInit(): void {

         // Create the form
         this.signInForm = this._formBuilder.group({
            username     : ['', [Validators.required,Validators.email]],
            password  : ['', Validators.required],
            rememberMe: ''
        }); 

    }

    signIn(): void {
      const username = this.signInForm.get('username').value;
      const password = this.signInForm.get('password').value;
       
      console.log({username,password});
      
      // Return if the form is invalid
      if (this.signInForm.invalid) {
          return;
      }
  
      // Disable the form
      this.signInForm.disable();
  
      // Hide the alert
      this.showAlert = false;
  
      // Sign in
      this._authService.signIn({ username: username, password: password }).subscribe(
          (data: any) => {
              //this._authService.loginUser(data.token);
              // Llamamos al método para obtener el usuario actual
              this.obtenerUsuarioActual();
  
              // Set the redirect url.
              // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
              // to the correct page after a successful sign in. This way, that url can be set via
              // routing file and we don't have to touch here.
              const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
  
              // Navigate to the redirect url
              this._router.navigateByUrl(redirectURL);
          },
          (error) => {
              // Re-enable the form
              this.signInForm.enable();
  
              // Reset the form
              this.signInNgForm.resetForm();
  
              // Set the alert
              this.alert = {
                  type: 'error',
                  message: 'Correo electrónico o contraseña incorrectos',
              };
  
              // Show the alert
              this.showAlert = true;
  
              console.log(error);
          }
      );
  }

  
  obtenerUsuarioActual(): void {
      // Return if the form is invalid
      if ( this.signInForm.invalid )
      {
          return;
      }

      // Disable the form
      this.signInForm.disable();


     this._authService.getUsuarioActual().subscribe(
       (user: any) => {
         if (user) {
           // Si se reciben los detalles del usuario correctamente, almacénalos en el servicio
           this._authService.setUser(user);

           this._userRol.obtenerRolDeUsuario(user.id).subscribe(
            (userRole: any) => {
                 localStorage.setItem('idUser', user.id); 
              // Redirigir según el rol del usuario
              localStorage.setItem('Rol', userRole.nombre); // Guarda el valor en el localStorage
    
              switch (userRole.nombre) {
                case 'ADMIN':
                 
                  this._router.navigate(['/dash-admin']);

                  break;
                case 'RESPONSABLE_VENTAS':
                  
                  this._router.navigate(['/dash-resp']);
                  break;
                case 'EMPRENDEDORA':
                  
                  this._router.navigate(['/dash-empre']);
                  break;
                case 'CLIENTE':
                  
                  this._router.navigate(['/home-cli']);
                  break;
                default:
                  this._authService.signOut(); // En caso de un rol desconocido o no válido, cerrar sesión
              }
            },
            (error) => {
              console.log('Error al obtener el rol del usuario:', error);
            }
          );
        } else {
          // Si no se reciben los detalles del usuario (puede ser nulo en caso de error),
          // puedes realizar alguna acción o mostrar un mensaje de error.
          console.log('No se pudo obtener el usuario actual.');
        }
      },
      (error) => {
        console.log('Error al obtener el usuario actual:', error);
      }
    );
   }


   redirectToHome() {
    this._router.navigate(['/home']);
  }
        
}
