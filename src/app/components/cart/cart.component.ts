import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { CouponService } from '../../services/coupons/coupon.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})

// cart.component.ts
export class CartComponent implements OnInit {
  cart: any[] = [];
  couponCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  subtotal: number = 0;
  totalAfterDiscount: number = 0;
  discount: number = 0;
  progressPercentage: number = 0;
  isCouponApplied: boolean = false; // لتخزين حالة تطبيق الكوبون
  savedDiscount = localStorage.getItem('discount');
  private readonly targetShippingAmount = 260;

  constructor(
    private cartService: CartService,
    private couponService: CouponService, // private cdRef: ChangeDetectorRef
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.cartObservable$.subscribe((cart) => {
      this.cart = cart;
      this.updateCartTotals();
    });

    const SavedCouponCode = localStorage.getItem('couponCode');
    if (SavedCouponCode) {
      this.validateCoupon(SavedCouponCode);
    }

    if (this.savedDiscount) {
      this.discount = +this.savedDiscount;
      this.totalAfterDiscount = this.cartService.getSubtotal() - this.discount;
      this.cartService.setAppliedDiscount(this.discount);
      this.updateCartTotals();
    }
    this.restoreCouponFromStorage();
  }

  restoreCouponFromStorage(): void {
    const savedCouponCode = localStorage.getItem('couponCode');
    const appliedCoupon = localStorage.getItem('appliedCoupon');

    if (savedCouponCode && appliedCoupon === 'true') {
      this.couponCode = savedCouponCode;
      this.applyCoupon(true);
    } else {
      this.updateCartTotals();
    }
  }

  applyCoupon(isRestoring: boolean = false): void {
    if (!this.couponCode && !isRestoring) {
      this.errorMessage = 'من فضلك أدخل كود الكوبون';
      return;
    }

    this.subtotal = this.cartService.getSubtotal();

    this.couponService.applyCoupon(this.couponCode, this.subtotal).subscribe(
      (response) => {
        if (!response.success) {
          if (!isRestoring) {
            this.errorMessage = response.message || 'كوبون غير صالح';
            this.successMessage = '';
          }
          // this.clearCouponData();
          return;
        }

        this.discount = response.discount;
        localStorage.setItem('discount', this.discount.toString());
        localStorage.setItem('couponCode', this.couponCode.toString());
        this.totalAfterDiscount = this.subtotal - this.discount;

        this.saveCouponToStorage();
        this.successMessage = response.message;
        this.errorMessage = '';

        this.cartService.setAppliedDiscount(this.discount);
        this.isCouponApplied = true;
        this.updateCartTotals();
      },
      () => {
        if (!isRestoring) {
          this.errorMessage = 'حدث خطأ أثناء تطبيق الكوبون';
        }
        this.clearCouponData();
      }
    );
  }

  validateCoupon(savedCouponCode: string): void {
    this.couponService.validateCoupon(savedCouponCode).subscribe(
      (response) => {
        if (!response.success) {
          this.cancelCoupon();
        } else {
          // ✅ الكوبون صالح، رجعه على الشاشة
          this.couponCode = savedCouponCode;

          if (response.discount_type === 'fixed') {
            // خصم ثابت
            this.discount = response.discount;
          } else {
            // خصم بنسبة مئوية
            this.discount = (this.subtotal * response.discount) / 100;
          }

          this.totalAfterDiscount = this.subtotal - this.discount;
          this.cartService.setAppliedDiscount(this.discount);
          this.successMessage = response.message;
          this.updateCartTotals();
          this.isCouponApplied = true;
        }
      },
      () => {
        this.cancelCoupon();
      }
    );
  }

  cancelCoupon(): void {
    this.discount = 0;
    this.totalAfterDiscount = this.cartService.getSubtotal();
    this.successMessage = '';
    this.errorMessage = 'تم إلغاء الكوبون لعدم صلاحيته';
    localStorage.removeItem('discount');
    localStorage.removeItem('couponCode');
    this.cartService.setAppliedDiscount(0);
    this.updateCartTotals();
  }

  clearCouponData(): void {
    this.couponCode = '';
    this.discount = 0;
    this.totalAfterDiscount = this.subtotal;
    localStorage.removeItem('couponCode');
    localStorage.removeItem('appliedCoupon');
  }

  saveCouponToStorage(): void {
    localStorage.setItem('couponCode', this.couponCode);
    localStorage.setItem('appliedCoupon', 'true');
  }

  updateQuantity(index: number, newQuantity: number): void {
    this.cartService.updateQuantity(index, newQuantity);
    this.updateCartTotals();
  }

  removeFromCart(productId: number): void {
    this.cartService.deleteCartItemById(productId);
    this.updateCartTotals();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.discount = 0;
    this.totalAfterDiscount = 0;
    this.clearCouponData();
  }

  updateCartTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.totalAfterDiscount = this.subtotal - this.discount;
    this.updateProgressBar();
  }

  updateProgressBar(): void {
    const total =
      this.totalAfterDiscount > 0 ? this.totalAfterDiscount : this.subtotal;
    this.progressPercentage = Math.min(
      100,
      parseFloat(((total / this.targetShippingAmount) * 100).toFixed(2))
    );
  }

  getProgressMessage(): string {
    const total =
      this.totalAfterDiscount > 0 ? this.totalAfterDiscount : this.subtotal;
    if (total >= this.targetShippingAmount) {
      return '🎉 تهانينا! وصلت للحد الأدنى للشحن المجاني ✅';
    }

    const remaining = this.targetShippingAmount - total;
    return `وصلت لـ ${this.progressPercentage}% - فاضل ${remaining} جنيه علشان توصل للحد الأدنى`;
  }
}
