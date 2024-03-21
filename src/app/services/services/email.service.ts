import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailDto } from '../models/emailDto';
import { Observable, catchError, throwError } from 'rxjs';
import {environment} from "../../../environment";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  url: string = environment.baseUrlm +'/api/email';
  constructor(private http: HttpClient) { }


  sendCodeVer(e: EmailDto): Observable<EmailDto> {
    const url = `${this.url}/sendCodeVerification`;
    return this.http.post<EmailDto>(url,e);
  }

  sendresetCode(e:EmailDto):Observable<boolean>{
    return this.http.put<boolean>(`${this.url}/resetPass/`, e);
  }

}
