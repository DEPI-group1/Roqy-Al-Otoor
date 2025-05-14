import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
// cart.service.ts
@Injectable({ providedIn: 'root' })
export class CartService {
  private cart: any[] = [];
  private cart$ = new BehaviorSubject<any[]>([]);
  public cartCount$ = new BehaviorSubject<number>(0);
  private appliedDiscount = 0;

  cartObservable$ = this.cart$.asObservable();
  cartCountObservable$ = this.cartCount$.asObservable();

  constructor(private snackBar: MatSnackBar) {
    this.loadCart();
  }

  public loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : [];
    this.syncCart();
  }

  private syncCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cart$.next([...this.cart]);
    this.cartCount$.next(this.getTotalQuantity());
  }

  addToCart(product: any): void {
    if (!this.isAuthenticated()) {
      this.showToast('يجب تسجيل الدخول لإضافة المنتجات للسلة ❌', 'error');
      return;
    }

    const existing = this.cart.find((p) => p.id === product.id);
    if (existing) {
      existing.quantity += 1;
      this.showToast(`${product.name} زادت كميته ✅`);
    } else {
      product.quantity = 1;
      this.cart.push(product);
      this.showToast(`${product.name} تمت إضافته للسلة 🎉`, 'success');
    }
    this.syncCart();
  }

  deleteCartItemById(productId: number): void {
    const index = this.cart.findIndex((item) => item.id === productId);
    if (index > -1) {
      this.cart.splice(index, 1);
      this.showToast('تم حذف المنتج من السلة ❌', 'error');
      this.syncCart();
    }
  }

  clearCart(): void {
    this.cart = [];
    this.appliedDiscount = 0;
    this.syncCart();
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity < 1) return;
    this.cart[index].quantity = quantity;
    this.syncCart();
  }

  getSubtotal(): number {
    return this.cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }

  getTotalQuantity(): number {
    return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('sanctum_token');
  }

  setAppliedDiscount(discount: number): void {
    this.appliedDiscount = discount;
  }
  
  getProductCount(): number {
    return this.cart ? this.cart.length : 0; // يعرض عدد المنتجات في العربة
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'إغلاق', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}

// export class CartService {
//   private cart: any[] = [];
//   private cartCount = new BehaviorSubject<number>(0);
//   private cart$ = new BehaviorSubject<any[]>([]);
//   private appliedCouponDiscount = 0;

//   cartCount$ = this.cartCount.asObservable();
//   cartObservable$ = this.cart$.asObservable();

//   constructor(private snackBar: MatSnackBar) {
//     this.loadCart();
//   }

//   isAuthenticated(): boolean {
//     const token = localStorage.getItem('sanctum_token');
//     return !!token; // يرجع true إذا كان التوكن موجودًا، وإلا false
//   }

//   // تحميل السلة من localStorage
//   loadCart() {
//     const storedCart = localStorage.getItem('cart');
//     this.cart = storedCart ? JSON.parse(storedCart) : [];
//     this.updateCart();
//   }

//   addToCart(product: any) {
//     if (!this.isAuthenticated()) {
//       this.showToast('يجب تسجيل الدخول لإضافة المنتجات للسلة ❌', 'error');
//       return;
//     }

//     const existingProduct = this.cart.find((p) => p.id === product.id);
//     if (existingProduct) {
//       existingProduct.quantity += 1;
//       this.showToast(`${product.name} زادت كميته في السلة ✅`);
//     } else {
//       product.quantity = 1;
//       this.cart.push(product);
//       this.showToast(`${product.name} تمت إضافته للسلة 🎉`, 'success');
//     }

//     this.updateCart();
//   }

//   // حذف منتج من السلة
//   deleteCartItemById(productId: number) {
//     const index = this.cart.findIndex((item) => item.id === productId);
//     if (index !== -1) {
//       this.cart.splice(index, 1);
//       this.showToast(`تم حذف المنتج من السلة ❌`, 'error');
//       this.updateCart();
//     }
//   }
//   getProductCount(): number {
//     return this.cart ? this.cart.length : 0; // يعرض عدد المنتجات في العربة
//   }

//   updateCartWithDiscount(discount: number) {
//     // تحديث العربة بعد تطبيق الخصم
//     const subtotal = this.getSubtotal();
//     const newTotal = subtotal - discount;
//     // تحديث الكارت مع المجموع الجديد بعد الخصم
//     console.log(`المجموع بعد الخصم: ${newTotal}`);
//   }

//   // تحديث كمية المنتج
//   updateQuantity(index: number, newQuantity: number) {
//     if (newQuantity < 1) return;
//     this.cart[index].quantity = newQuantity;
//     this.updateCart();
//   }

//   // الحصول على عناصر السلة
//   getCartItems() {
//     return this.cart;
//   }

//   // حساب إجمالي الكمية
//   getTotalQuantity(): number {
//     if (!this.cart || this.cart.length === 0) return 0;
//     return this.cart.reduce((total, item) => total + (item.quantity || 1), '');
//     // reduce => عشان تجمع الكميات لكل منتجات السله
//     // reduce =>  تجمع القيم بشكل تراكمي وترجع الناتج النهائي، أي إجمالي الكمية لجميع المنتجات في السلة
//     // (item.quantity || 1) => بنتحقق ان فيه خاصيه  quantity ولو مش موجوده او القيمه بصفر هيبقى افتراضي بواحد
//   }

//   // حساب المجموع الفرعي
//   getSubtotal(): number {
//     return this.cart.reduce(
//       (total, item) => total + item.price * (item.quantity || 1),
//       0
//     );
//   }

//   // تطبيق خصم الكوبون
//   applyCouponDiscount(discount: number) {
//     this.appliedCouponDiscount = discount;
//     this.updateCart();
//   }

//   // إزالة خصم الكوبون
//   removeCouponDiscount() {
//     this.appliedCouponDiscount = 0;
//     this.updateCart();
//   }

//   // حساب المجموع النهائي
//   getTotal(): number {
//     const total = this.getSubtotal() - this.appliedCouponDiscount;
//     return total > 0 ? total : 0;
//   }

//   private updateCart() {
//     localStorage.setItem('cart', JSON.stringify(this.cart));
//     this.cartCount.next(this.getTotalQuantity());
//     this.cart$.next([...this.cart]);

//     // ممكن تبعت المجموع بعد الخصم في BehaviorSubject لو بتستخدمه في أماكن تانية
//     // مثلاً تعمل BehaviorSubject جديدة للمجموع:
//     // this.totalAmount.next(this.getTotal());
//   }

//   // عرض إشعار للمستخدم
//   private showToast(message: string, type: 'success' | 'error' = 'success') {
//     this.snackBar.open(message, 'إغلاق', {
//       duration: 3000,
//       panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
//       horizontalPosition: 'center',
//       verticalPosition: 'top',
//     });
//   }

//   // تفريغ السلة
//   clearCart() {
//     this.cart = [];
//     this.appliedCouponDiscount = 0;
//     this.updateCart();
//   }

//   getRemainingPercentage(total: number): string {
//     const target = 260;
//     if (total >= target) {
//       return 'تهانينا! وصلت للحد الأدنى للشحن المجاني ✅';
//     }
//     const remaining = target - total;
//     const percentage = (remaining / target) * 100;
//     return `وصلت لـ ${percentage}% - فاضل ${remaining} جنيه علشان توصل للحد الأدنى`;
//   }
// }
