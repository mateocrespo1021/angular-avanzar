// shared-favorito.service.ts
import { Injectable } from '@angular/core';
import { PublicacionesService } from './publicaciones.service';
import { FavoritosService } from './favoritos.service';
import { InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { Destacados } from '../models/destacados';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class SharedFavoritoService {
  constructor(
    private _publicacionesService: PublicacionesService,
    private _favoritoService: FavoritosService,
  ) {}

  destacados: Destacados;
  destacadoCreated: any;
  


  toggleFavorito(publicacion: InventarioPublicaciones) {
    if (!publicacion.visible) {
        // Acción cuando se hace clic por primera vez
        const userJSON = localStorage.getItem('user');
        const user = JSON.parse(userJSON);

        this._publicacionesService.buscarPublicacionId(publicacion.idPublicacion).subscribe(
            (datos: InventarioPublicaciones) => {
               
                this.destacados = new Destacados();
                this.destacados.estadoDestacado = true;
                this.destacados.fecha = new Date().toISOString();
                this.destacados.publicaciones = datos;
                this.destacados.usuario = user;
                this._favoritoService.saveFavorito(this.destacados).subscribe(
                    (datos: Destacados) => {
                        this.destacadoCreated = datos;

                        // Cambia el estado de visible en la publicacion actual
                        publicacion.visible = true;
                    },
                    
                    error => {
                        console.error('Ocurrió un error al guardar el favorito:', error);
                    }
                );
            },
            
            error => {
                console.error('Ocurrió un error al obtener la lista:', error);
            }
        );

        // Realiza la acción que desees aquí
    } else {
    
        // Cambia el estado de visible en la publicacion actual
        publicacion.visible = false;
    }
}
}
