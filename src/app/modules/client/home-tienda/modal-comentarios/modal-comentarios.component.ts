import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Comentario } from 'app/services/models/comentario';
import { ComentariosDto } from 'app/services/models/comentariosDto';
import { Publicacion } from 'app/services/models/publicaciones';
import { Usuario } from 'app/services/models/usuario';
import { ComentarioService } from 'app/services/services/comentarios.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-modal-comentarios',
  templateUrl: './modal-comentarios.component.html',
  styleUrls: ['./modal-comentarios.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterLink, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, NgFor, MatFormFieldModule, FormsModule, MatInputModule, TextFieldModule, MatDividerModule, ReactiveFormsModule, MatTooltipModule, NgIf, NgClass],
})
export class ModalComentariosComponent {

  user: User;
  page: number = 0;
  idUser: number = 0;
  commentLimit:number =3;
  createCommintForm: UntypedFormGroup;
  comentario = new Comentario();
  comentarioDto = new ComentariosDto();
  publicacion = new Publicacion();
  usuario = new Usuario();
  listComments: ComentariosDto[] = [];
  listCommentarios: Comentario[] = [];
  banMoreComments = false;
  @ViewChild('modalCommitNgForm') modalCommitNgForm: NgForm;
  private _unsubscribeAll: Subject<any> = new Subject<any>();



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _commitService: ComentarioService,
    private _formBuilder: UntypedFormBuilder,
    private _userService: UserService,
    
  ) { }


  ngOnInit(): void {  

    // Subscribe to the user service
    this._userService.user$
    .pipe((takeUntil(this._unsubscribeAll)))
    .subscribe((user: User) =>
    {
        this.user = user;
    });


    this.idUser = parseInt(localStorage.getItem("idUser") ?? '0');

    //Create the form 
    this.createCommintForm = this._formBuilder.group({
      commit: ['', Validators.maxLength(230)],
    });
    this.comentario.usuario = this.usuario;
    this.comentario.publicaciones = this.publicacion;

    //cargar comentarios
    this._commitService.listCommentsPubli(this.data.idPubli, this.page)
      .subscribe({
        next: (response) => {
          this.listComments = response;
          this.page++;
        }, error: (error) => {

        }
      });
  }

  createCommint(): void {
    this.createCommintForm.get('commit').setValue(this.createCommintForm.get('commit').value.trim())
    //creo las validaciones para que no me aparesca de inicio las validaciones
    this.createCommintForm.get('commit').setValidators([Validators.required, Validators.maxLength(230)]);
    this.createCommintForm.get('commit').updateValueAndValidity();
    if (this.createCommintForm.invalid) {
      return;
    }

    if (this.idUser != 0) {
      this.comentario.publicaciones.idPublicacion = this.data.idPubli;
      this.comentario.usuario.id = this.idUser;
      this.comentario.texto = this.createCommintForm.get('commit').value;
      if(this.commentLimit>0){
        this._commitService.createCommit(this.comentario)
        .subscribe({
          next: (response) => {
            this.page = 0;
            this._commitService.listCommentsPubli(this.data.idPubli, this.page)
              .subscribe({
                next: (response) => {

                  this.listComments = Array.from(response);
                  this.commentLimit--;
                  this.createCommintForm.reset();
                }, error: (error) => {

                }
              });

          }, error: (error) => {


          }
        });
      }

    }


  }

  loadMoreComments(): void {

    if (!this.banMoreComments) {

      this._commitService.listCommentsPubli(this.data.idPubli, this.page)
        .subscribe({
          next: (response) => {
            if (response.length > 0) {
              this.listComments.push(...response);
              this.page++;

            } else {

              this.banMoreComments = true;
            }
          }, error: (error) => {

          }
        });
    }





  }
}
