
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../../environment";

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {
  url: string = environment.baseUrlm +'/api/usuariorol';
  constructor(private http: HttpClient) { }


  obtenerRolDeUsuario(usuarioId: number): Observable<any> {
    const url = `${this.url}/nombreRol/${usuarioId}`;
    return this.http.get<any>(url);
  }


}
