import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true, // ✅ تأكد إنه موجود
  imports: [CommonModule, RouterModule], // ✅ أضف `CommonModule`
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css'],
})
export class BottomNavComponent implements OnInit {
  cartCount: number = 0;
  wishListCount: number = 0;
  cart: any[] = [];

  constructor(
    private router: Router,
    public authServise: AuthService,
    public cartService: CartService,
    private wishListService: WishlistService
  ) {}

  isMobile: boolean = false;

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
    // console.log('isMobile:', this.isMobile);
  }

  ngOnInit() {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count || 0; // ✅ تأكد من أن العدد لا يصبح NaN
    });

    this.wishListService.wishListCount$.subscribe((count) => {
      this.wishListCount = count || 0;
    });

    this.cartService.loadCart(); // ✅ تحميل بيانات السلة
    this.wishListService.loadWishlist(); // ✅ تحميل بيانات المفضلة

    this.onResize(); // فحص حجم الشاشة عند بدء التشغيل
  }

  handleProfileClick(): void {
    if (this.authServise.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.authServise.showToast(`${''} برجاء إنشاء حساب أولا  ❌ `, 'error');
    }
  }
}
