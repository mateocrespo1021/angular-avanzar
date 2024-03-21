import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Publicacion, PublicacionA, PublicacionB } from '../models/publicaciones';
import {environment} from "../../../environment";

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private baseUrl = environment.baseUrlm +'/api/publicaciones'; // Cambia la URL a la de tu servidor

  constructor(private http: HttpClient) { }

  guardarPublicación(post: Publicacion): Observable<Publicacion> {
    return this.http.post<Publicacion>(`${this.baseUrl}/registrar`, post);
  }

  buscarPublicacionId(idPublicacion: any): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.baseUrl}/buscar/${idPublicacion}`)
  }

  updatePublicacionById(idPublicacion: number, publicacion: PublicacionA): Observable<object> {
    return this.http.put(`${this.baseUrl}/actualizar/${idPublicacion}`, publicacion);
  }

  updatePublicacionByIdN(idPublicacion: number, publicacion: PublicacionB): Observable<object> {
    return this.http.put(`${this.baseUrl}/actualizarN/${idPublicacion}`, publicacion);
  }

  eliminadoLogico(idPublicacion: any) {
    return this.http.put(`${this.baseUrl}/eliminar/${idPublicacion}`, null);
  }

  listarPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.baseUrl}/listarProducto`)
  }

  listarPublicacionesServicios(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.baseUrl}/listarServicio`)
  }

  informacionPublicacionCommentarios(idUsu):Observable<Publicacion[]>{
    return this.http.get<Publicacion[]>(`${this.baseUrl}/recuperarInfoPubliComent/${idUsu}`)
  }

  listPublicacionesUs(idVendedor:number):Observable<Publicacion[]>{
    return this.http.get<Publicacion[]>(`${this.baseUrl}/PublicacionxVendedor/${idVendedor}`);
   }

  BuscarTituloPublicacion(tituloPublicacion: any) {
    return this.http.get(`${this.baseUrl}/buscarPublicacion/${tituloPublicacion}`);
  }
}
