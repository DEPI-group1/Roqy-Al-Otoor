import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiURL } from '../../constants/api';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  applyCoupon(couponCode: string, subtotal: number): Observable<any> {
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

    return this.http
      .post(
        `${apiURL}/coupons`,
        { coupon: couponCode, subtotal: subtotal },
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error));
        })
      );
  }

  validateCoupon(couponCode: string): Observable<any> {
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

    return this.http
      .get(`${apiURL}/coupons/validate/${couponCode}`, { headers })
      .pipe(
        catchError((error: any) => {
          const errorMsg =
            error?.error?.message || 'حدث خطأ في التحقق من الكوبون';
          return throwError(() => new Error(errorMsg));
        })
      );
  }
}
