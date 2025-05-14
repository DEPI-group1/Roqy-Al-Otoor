import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'الرجاء إدخال البريد وكلمة المرور.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.showToast('مرحباً بك 👋', 'success');
        this.router.navigate(['']);
      },
      error: (err) => {
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.';
        }
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  logout() {
    this.authService.logout();
    this.errorMessage = '';
    console.log('تم تسجيل الخروج بنجاح');
  }
}
