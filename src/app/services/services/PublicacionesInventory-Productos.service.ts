import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take, throwError,} from 'rxjs';
import {  InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { Usuario } from 'app/services/models/usuario';
import {environment} from "../../../environment";

@Injectable({providedIn: 'root'})
export class PublicacionesInventoryProductos
{
    // Private
    private _publicacion: BehaviorSubject<InventarioPublicaciones | null> = new BehaviorSubject(null);
    private _publicaciones: BehaviorSubject<InventarioPublicaciones[] | null> = new BehaviorSubject(null);
    user: Usuario;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {

        this.listarServicio(); // Llama a tu método para cargar los datos iniciales
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------



    get publicacion$(): Observable<InventarioPublicaciones>
    {
        return this._publicacion.asObservable();
    }

    get publicaciones$(): Observable<InventarioPublicaciones[]>
    {
        return this._publicaciones.asObservable();
    }

    private handleError(error: any) {
        console.error('Ocurrió un error:', error);
        return throwError('Error en el servicio. Por favor, inténtalo de nuevo más tarde.');
      }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    listarServicio(): void {
        this._httpClient.get<InventarioPublicaciones[]>(environment.baseUrlm+"/api/publicaciones/listarProducto")
          .subscribe((data) => {
            this._publicaciones.next(data); // Actualiza el BehaviorSubject con los datos obtenidos
          });
      }

      obtenerListaPublicacionesXProducto(): Observable<InventarioPublicaciones[]> {
        return this._httpClient.get<InventarioPublicaciones[]>(environment.baseUrlm+"/api/publicaciones/listarProducto")
          .pipe(
            catchError(this.handleError)
          );
      }


      getPublicacionById(id: number): Observable<InventarioPublicaciones>
      {
          return this._publicaciones.pipe(
              take(1),
              map((publicaciones) =>
              {
                  // Find the product
                  const publicacion = publicaciones.find(item => item.idPublicacion === id) || null;

                  // Update the publicacion
                  this._publicacion.next(publicacion);

                  // Return the publicacion
                  return publicacion;
              }),
              switchMap((publicacion) =>
              {
                  if ( !publicacion )
                  {
                      return throwError('Could not found publicacion with id of ' + id + '!');
                  }

                  return of(publicacion);
              }),
          );
      }
}


