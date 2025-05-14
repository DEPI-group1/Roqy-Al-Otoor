import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { apiURL } from '../../constants/api';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfileData(): Observable<any> {
    const token = localStorage.getItem('sanctum_token'); // الحصول على التوكن من LocalStorage

    if (!token) {
      return throwError(
        () => new Error('لم يتم العثور على التوكن، الرجاء تسجيل الدخول')
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // إضافة التوكن إلى الهيدر
      Accept: 'application/json',
    });

    return this.http.get<any>(`${apiURL}/profile`, { headers }); // إرسال الطلب إلى API واسترجاع البيانات
  }

  updateProfileData(apdatedData: any): Observable<any> {
    const token = localStorage.getItem('sanctum_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });

    if (!token) {
      return throwError(() => new Error(' حدث خطأ الرجاء تسجيل الدخول  '));
    }

    return this.http.put(`${apiURL}/profile/update`, apdatedData, { headers });
  }
}
