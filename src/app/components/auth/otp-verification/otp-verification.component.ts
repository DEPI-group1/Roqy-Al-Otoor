import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css'],
})
export class OtpVerificationComponent implements OnInit {
  email = ''; // يجب أن يتم تمريره من صفحة التسجيل
  code = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // محاولة جلب البريد الإلكتروني من التخزين المحلي بعد التسجيل
    this.email = localStorage.getItem('user_email') || '';
  }

  activateAccount() {
    if (!this.email || !this.code) {
      alert('يرجى إدخال البريد الإلكتروني وكود التفعيل.');
      return;
    }

    const data = { email: this.email, code: this.code };

    this.http
      .post('http://127.0.0.1:8000/api/activate-account', data)
      .subscribe(
        (response) => {
          alert('تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.');
          this.router.navigate(['/login']); // 👈 توجيه المستخدم لصفحة تسجيل الدخول
        },
        (error) => {
          alert('كود التفعيل غير صحيح أو منتهي الصلاحية.');
        }
      );
  }

}
