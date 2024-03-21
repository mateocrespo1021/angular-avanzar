import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Vendedor } from '../models/vendedora';
import {environment} from "../../../environment";

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  private baseUrl = environment.baseUrlm +'/api/vendedor'; // Cambia la URL a la de tu servidor

  constructor(private http: HttpClient) { }

  registrarVendedor(vendedor: Vendedor, idSubscripcion: number): Observable<Vendedor> {
    const url = `${this.baseUrl}/registrar/${idSubscripcion}`;
    return this.http.post<Vendedor>(url, vendedor);
  }


  buscarVendedoraId(idVendedora: any): Observable<Vendedor> {
    return this.http.get<Vendedor>(`${this.baseUrl}/usuario/${idVendedora}`)
  }

}
