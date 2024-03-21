import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CategoriaServicio } from 'app/modules/emprendedora/ecommerce copy/inventory/inventoryServicios.types';
import {environment} from "../../../environment";

@Injectable({
  providedIn: 'root'
})
export class CategoriaServicioService {

  private baseUrl = environment.baseUrlm +'/api/categoriaServicio';

  constructor(private http: HttpClient) { }


  getCategoriaServicio(idCategoria: any): Observable<CategoriaServicio> {
    return this.http.get<CategoriaServicio>(`${this.baseUrl}/buscar/${idCategoria}`)
  }

}
