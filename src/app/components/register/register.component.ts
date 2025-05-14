import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  showOtpSection = false;
  // otpCode = '';
  // نموذج البيانات
  userData = {
    name: '',
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // حالة OTP
  otpData = {
    code: '',
    isSent: false,
    isVerified: false,
    countdown: 0,
    error: '',
  };

  // حالة التحميل
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // إرسال OTP
  async sendOtp() {
    console.log('تم الضغط على الزر'); // للتأكد من تنفيذ الدالة

    if (!this.validateBasicInfo()) {
      console.log('التحقق من المعلومات فشل', this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.authService
        .sendOtp(this.userData.email)
        .toPromise();
      console.log('استجابة الخادم:', response);

      this.showOtpSection = true;
      this.otpData.isSent = true;
      this.startCountdown();
    } catch (err) {
      console.error('حدث خطأ:', err);
      this.errorMessage = 'فشل في إرسال رمز التحقق، يرجى المحاولة لاحقاً';
    } finally {
      this.isLoading = false;
    }
  }
  // التحقق من OTP
  verifyOtp() {
    console.log('تم الضغط على التحقق'); // للتأكد من تنفيذ الدالة

    if (!this.otpData.code || this.otpData.code.length !== 6) {
      this.otpData.error = 'يجب إدخال رمز التحقق المكون من 6 أرقام';
      console.log(this.otpData.error);
      return;
    }

    this.isLoading = true;
    this.otpData.error = '';

    console.log('بيانات الإرسال:', {
      ...this.userData,
      otp: this.otpData.code,
    });

    this.authService
      .verifyOtpAndRegister({
        ...this.userData,
        otp: this.otpData.code,
      })
      .subscribe({
        next: (res) => {
          console.log('نجاح:', res);
          this.otpData.isVerified = true;
          this.isLoading = false;
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('خطأ:', err);
          this.otpData.error = 'رمز التحقق غير صحيح أو انتهت صلاحيته';
          this.isLoading = false;
        },
      });
  }
  // إعادة إرسال OTP
  resendOtp() {
    if (this.otpData.countdown > 0) return;

    this.isLoading = true;
    this.authService.resendOtp(this.userData.email).subscribe({
      next: () => {
        this.startCountdown();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'فشل في إعادة إرسال الرمز';
        this.isLoading = false;
        console.error('Error resending OTP:', err);
      },
    });
  }

  // بدء العد التنازلي لإعادة الإرسال
  private startCountdown() {
    this.otpData.countdown = 120; // 2 دقيقة
    const interval = setInterval(() => {
      this.otpData.countdown--;
      if (this.otpData.countdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  // التحقق من البيانات الأساسية
  private validateBasicInfo(): boolean {
    // التحقق من الحقول المطلوبة
    if (
      !this.userData.name ||
      !this.userData.phone_number ||
      !this.userData.email ||
      !this.userData.password ||
      !this.userData.confirmPassword
    ) {
      this.errorMessage = 'جميع الحقول مطلوبة';
      return false;
    }

    // التحقق من تطابق كلمة المرور
    if (this.userData.password !== this.userData.confirmPassword) {
      this.errorMessage = 'كلمة المرور غير متطابقة';
      return false;
    }

    // التحقق من صحة البريد الإلكتروني
    if (!this.validateEmail(this.userData.email)) {
      this.errorMessage = 'البريد الإلكتروني غير صالح';
      return false;
    }

    // التحقق من صحة رقم الهاتف
    if (!this.validatePhone(this.userData.phone_number)) {
      this.errorMessage = 'رقم الهاتف غير صالح';
      return false;
    }

    return true;
  }
  // التحقق من صحة البريد الإلكتروني
  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // التحقق من صحة رقم الهاتف
  private validatePhone(phone: string): boolean {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  }

  // عرض الوقت المتبقي لإعادة الإرسال
  get countdownDisplay(): string {
    const minutes = Math.floor(this.otpData.countdown / 60);
    const seconds = this.otpData.countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
}
