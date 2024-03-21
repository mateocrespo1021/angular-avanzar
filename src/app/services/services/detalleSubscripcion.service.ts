import { DetalleSubscripcion } from './../models/detalleSubscripcion';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { mensajeAlertasDto } from '../models/mensajeAlertasDto';
import {environment} from "../../../environment";

@Injectable({
  providedIn: 'root'
})
export class DetalleSubscripcionService {

  private baseUrl = environment.baseUrlm +'/api/detalleSubscripcion'; // Cambia la URL a la de tu servidor

  constructor(private http: HttpClient) { }

  obtenerLista(): Observable<DetalleSubscripcion[]> {
    const url = `${this.baseUrl}/listar`;
    return this.http.get<DetalleSubscripcion[]>(url);
  }


  putDetalleSubscripcion(idDetalleSubscripcion: number, idNuevaSubscripcion: number): Observable<object> {
    // Realizar una solicitud PUT al endpoint del backend
    return this.http.put(`${this.baseUrl}/actualizarDetalleSubscripcion/${idDetalleSubscripcion}/${idNuevaSubscripcion}`, null);
  }


  DetalleSubcripciónById(idDetalle: any): Observable<DetalleSubscripcion> {
    return this.http.get<DetalleSubscripcion>(`${this.baseUrl}/buscar/${idDetalle}`)
  }

  updateDetalleSubscripcion(id: number, detalle: DetalleSubscripcion): Observable<object> {
    return this.http.put(`${this.baseUrl}/actualizar/${id}`, detalle);
  }

  limitPost():Observable<mensajeAlertasDto>{
    return this.http.get<mensajeAlertasDto>(`${this.baseUrl}/comprobarLimite`);
  }

  limitEstatusPost():Observable<mensajeAlertasDto>{
    return this.http.get<mensajeAlertasDto>(`${this.baseUrl}/comprobarPubAct`);
  }

  obtenerDetallePorVendedorId(vendedorId: number): Observable<DetalleSubscripcion> {
    return this.http.get<DetalleSubscripcion>(`${this.baseUrl}/extraerMembresia/${vendedorId}`)
  }

}
