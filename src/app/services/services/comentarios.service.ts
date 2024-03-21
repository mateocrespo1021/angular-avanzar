import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Comentario } from '../models/comentario';
import { ComentariosDto } from '../models/comentariosDto';
import { Publicacion } from '../models/publicaciones';
import {environment} from "../../../environment";
@Injectable({
    providedIn: 'root'
})
export class ComentarioService {

    private baseUrl=environment.baseUrlm +'/api/comentarios';
    constructor(private http: HttpClient) { }

   createCommit(c:Comentario):Observable<Comentario>{
    const url=`${this.baseUrl}/registrar`;
    return this.http.post<Comentario>(url,c);
   }

   listCommentsPubli(idPubli:number, page: number):Observable<ComentariosDto[]>{
    return this.http.get<ComentariosDto[]>(`${this.baseUrl}/listCommentP/${idPubli}/${page}`);
   }

   listarComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.baseUrl}/listar`);
  }

  deleteComment(idComment:number):Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/deleteComment/${idComment}`);
  }

  listCommentsUs(idPubli:number):Observable<Comentario[]>{
    return this.http.get<Comentario[]>(`${this.baseUrl}/Comentarioxus/${idPubli}`);
   }

}
