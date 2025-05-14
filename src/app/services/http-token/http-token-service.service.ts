import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://127.0.0.1:8000';

@Injectable({
  providedIn: 'root',
})
export class HttpTokenServiceService {
  constructor(private http: HttpClient) {}

  // ✅ جلب CSRF Token لحماية الطلبات
  // getCSRFToken(): Observable<any> {
  //   return this.http.get(`${baseURL}/sanctum/csrf-cookie`, {
  //     withCredentials: true,
  //   });
  // }

  // ✅ تسجيل الدخول
  // login(credentials: { email: string; password: string }): Observable<any> {
  //   return this.http.post(`${baseURL}/api/login`, credentials, {
  //     withCredentials: true,
  //   });
  // }

  // ✅ جلب بيانات المستخدم
  // getUser(): Observable<any> {
  //   return this.http.get(`${baseURL}/api/user`, { withCredentials: true });
  // }

  // ✅ تسجيل الخروج
  // logout(): Observable<any> {
  //   return this.http.post(
  //     `${baseURL}/api/logout`,
  //     {},
  //     { withCredentials: true }
  //   );
  // }
}
