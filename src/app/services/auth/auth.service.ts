import { apiURL } from '../../constants/api';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'sanctum_token';
  private readonly USER_KEY = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const token = this.getToken();
    const user = localStorage.getItem(this.USER_KEY);

    if (token && user) {
      this.http
        .get(`${apiURL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (userData) => {
            // this._currentUser.set(userData);
            localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
          },
          error: () => this.logout(), // إذا كان التوكن غير صالح، يتم تسجيل الخروج
        });
    }
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${apiURL}/send-otp`, { email }).pipe(
      catchError((error) => {
        console.error('خطأ في إرسال OTP:', error);
        return throwError(() => new Error('فشل إرسال رمز التحقق'));
      })
    );
  }

  verifyOtpAndRegister(userData: any): Observable<any> {
    return this.http
      .post(`${apiURL}/register`, userData)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${apiURL}/resend-otp`, { email });
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${apiURL}/login`, { email, password })
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  private handleAuthSuccess(response: any) {
    const token = response.token || response.sanctum_token;

    if (token) {
      this.saveToken(token);
      console.log('✅ تم استلام وحفظ التوكن:', token);
    } else {
      console.error('⚠️ لم يتم استلام التوكن في الاستجابة!', response);
    }

    if (response.user) {
      // this._currentUser.set(response.user);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // -------------------
  // isLoggedIn(): boolean {
  //   return !!this.getToken() && !!this._currentUser();
  // }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log(
      'التوكن في localStorage:',
      localStorage.getItem('sanctum_token')
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // عرض إشعار للمستخدم
  public showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'إغلاق', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
