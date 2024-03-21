import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserA } from 'app/core/user/user.types';
import { Usuario } from 'app/services/models/usuario';
import { catchError, map, Observable, ReplaySubject, tap, throwError } from 'rxjs';
import {environment} from "../../../environment";

@Injectable({ providedIn: 'root' })
export class UserService {
  url: string = environment.baseUrlm+'/api/usuarios';
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: User) {
    //Store the value
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current logged in user data
   */
  get(): Observable<User> {
    return this._httpClient.get<User>(`${this.url}/listar`).pipe(
      tap((user) => {
        this._user.next(user);
      }),
    );
  }

  /**
   * Update the user
   *
   * @param user
   */
  update(user: User): Observable<any> {
    return this._httpClient.patch<User>('api/common/user', { user }).pipe(
      map((response) => {
        this._user.next(response);
      }),
    );
  }

  // Método para registrar un nuevo usuario
  registrarUsuario(usuario: User, rolId: number): Observable<User> {
    const url = `${this.url}/registrar/${rolId}`;
    return this._httpClient.post<User>(url, usuario);
  }

  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError('Error en el servicio. Por favor, inténtalo de nuevo más tarde.');
  }



  registrarUsuarioConFoto(usuario: User, rolId: number, file: any | null): Observable<User> {
    const formData = new FormData();
    formData.append('usuario', JSON.stringify(usuario));

    if (file) {
      formData.append('file', file);
    }

    const url = `${this.url}/registrarConFoto/${rolId}`;

    return this._httpClient.post<User>(url, formData);
  }



  uploadFile(formData: FormData): Observable<any> {
    return this._httpClient.post(`${this.url}/upload`, formData);
  }



  actualizarUsuario(usuarioId: number, usuario: any, file: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', JSON.stringify(usuario));
    if (file) {
      formData.append('file', file);
    }

    return this._httpClient.put(`${this.url}/actualizarUsuarioConFoto/${usuarioId}`, formData);
  }


  actualizarContrasena(oldPassword: string, newPassword: string): Observable<any> {
    const requestBody = {
      contrasenaActual: oldPassword,
      contrasenaNueva: newPassword
    };

    const url = `${this.url}/actualizar-password`;

    return this._httpClient
      .put(url, requestBody)
      .pipe(
        /*catchError(() => throwError(() => new Error('test')))*/
        catchError((error) => throwError(() =>error))

      );
  }

  obtenerListaEmprendedor(): Observable<Usuario[]> {
    const url = `${this.url}/listarEmprendedores`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  obtenerListaCliente(): Observable<Usuario[]> {
    const url = `${this.url}/listarClientes`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  obtenerListaResponsable(): Observable<Usuario[]> {
    const url = `${this.url}/listarResponsables`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  obtenerListaResponsableOrdenA(): Observable<Usuario[]> {
    const url = `${this.url}/listarResponsablesEstadoActivo`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  obtenerListaResponsableOrdenI(): Observable<Usuario[]> {
    const url = `${this.url}/listarResponsablesEstadoInactivo`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  obtenerListEmprendedorOrdenA(): Observable<Usuario[]> {
    const url = `${this.url}/listarEmprendedorEstadoActivo`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  obtenerListEmprendedorOrdenI(): Observable<Usuario[]> {
    const url = `${this.url}/listarEmprendedorEstadoInactivo`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  obtenerListClientOrdenA(): Observable<Usuario[]> {
    const url = `${this.url}/listarClienteEstadoActivo`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  obtenerListClientOrdenI(): Observable<Usuario[]> {
    const url = `${this.url}/listarClienteEstadoInactivo`;
    return this._httpClient.get<Usuario[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  BuscarUsername(username: any) {
    return this._httpClient.get(`${this.url}/buscar/${username}`);
  }
  eliminadoLogico(id: any) {
    return this._httpClient.put(`${this.url}/eliminar/${id}`, null);
  }

  buscarUserId(idUsuario: any): Observable<User> {
    return this._httpClient.get<User>(`${this.url}/buscarUser/${idUsuario}`)
  }

  updateUserById(id: number, usuario: User): Observable<object> {
    return this._httpClient.put(`${this.url}/actualizar/${id}`, usuario);
  }

  updateUserById2(id: number, usuario: UserA): Observable<object> {
    return this._httpClient.put(`${this.url}/actualizar/${id}`, usuario);
  }

      BuscarUser(username: any):Observable<Usuario> {
        return this._httpClient.get<Usuario>(`${this.url}/buscar/${username}`);
      }




}
