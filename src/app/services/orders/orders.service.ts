import { Injectable } from '@angular/core';
import { apiURL } from '../../constants/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {
    const token = localStorage.getItem('sanctum_token');

    if (!token) {
      return throwError(
        () => new Error('لم يتم العثور على التوكن، الرجاء تسجيل الدخول')
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });

    return this.http.get<any>(`${apiURL}/user/orders`, { headers });
  }
}
