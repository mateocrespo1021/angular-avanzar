
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Persona } from '../models/persona';
import { Usuario } from '../models/usuario';
import { User } from 'app/core/user/user.types';
import {environment} from "../../../environment";


@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  url: string = environment.baseUrlm +'/api/persona';
  constructor(private http: HttpClient) { }


  savePersona(persona: Persona): Observable<Persona>{
    return this.http.post<Persona>(this.url+'/registrar',persona);
  }

  buscarPersonaPorCedula(cedula: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/findByCedula/${cedula}`);
  }

  buscarPersonaPorCorreo(correo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/findByCorreo/${correo}`);
  }

  updatePersonaById(id: number, persona: Persona): Observable<object> {
    return this.http.put(`${this.url}/actualizar/${id}`, persona);
  }

  obtenerResumen(): Observable<any> {
    const url = `${this.url}/data1`;
    return this.http.get(url);
  }
  actualizarPersona(idPersona: any, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.url}/actualizar/${idPersona}`, persona);
  }

  actualizarName(id: any, user: User): Observable<any> {
    return this.http.put<User>(`${this.url}/actualizarP/${id}`, user);
  }

  obtenerResumen2(idVendedor: any): Observable<any> {
    return this.http.get(`${this.url}/data2/${idVendedor}`);
  }
}
