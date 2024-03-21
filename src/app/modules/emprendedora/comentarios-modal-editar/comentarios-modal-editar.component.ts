import { TextFieldModule } from '@angular/cdk/text-field';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { ComentariosDto } from 'app/services/models/comentariosDto';
import { ComentarioService } from 'app/services/services/comentarios.service';

@Component({
  selector: 'app-comentarios-modal-editar',
  templateUrl: './comentarios-modal-editar.component.html',
  styleUrls: ['./comentarios-modal-editar.component.scss'],
  standalone: true,
  imports: [RouterLink, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, NgFor, MatFormFieldModule, FormsModule, MatInputModule, TextFieldModule, MatDividerModule, ReactiveFormsModule, MatTooltipModule, NgIf, NgClass],
})
export class ComentariosModalEditarComponent implements OnInit {


  listComments: ComentariosDto[] = [];
  page: number = 0;
  banMoreComments = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _commitService: ComentarioService,
    private _userService: UserService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }
  ngOnInit(): void {

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

  deleteselectedComment(idComment: number): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Eliminar comentario',
      message: '¿Está seguro de que desea eliminar este comentario? Esta acción no se puede deshacer.',
      actions: {
        confirm: {
          label: 'Eliminar',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        this._commitService.deleteComment(idComment)
          .subscribe({
            next: (response) => {
              this.listComments = this.listComments.filter((comentario) => comentario.id !== idComment);

            }, error: (error) => {

            }

          })
      }
    });
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
