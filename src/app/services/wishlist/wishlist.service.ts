import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlist: any[] = [];
  private wishlistCount = new BehaviorSubject<number>(0);
  wishListCount$ = this.wishlistCount.asObservable();

  constructor(private snackBar: MatSnackBar) {
    this.loadWishlist();
  }

  // تحميل البيانات من `localStorage`
  loadWishlist() {
    const storedWishlist = localStorage.getItem('wishlist');
    this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    this.wishlistCount.next(this.getTotalQuantity());
  }

  //  إرجاع إجمالي عدد المنتجات في المفضلة
  getTotalQuantity(): number {
    return this.wishlist.length;
  }

  getWishlistItems() {
    return this.wishlist;
    // return [...this.wishlist]; //  إرجاع نسخة جديدة لمنع التعديل المباشر
  }

  addToWishList(product: any) {
    const existingProduct = this.wishlist.find((p) => p.id === product.id);

    if (existingProduct) {
      this.showToast(`${product.name} موجود بالفعل في المفضلة ❤️`, 'info');
    } else {
      this.wishlist.push({ ...product, quantity: 1 }); // 🔥 تعيين `quantity`
      this.updateWishList();
      this.showToast(`${product.name} تمت إضافته للمفضلة 🎉`, 'success');
    }
  }

  deleteWishListItemById(productId: number) {
    const index = this.wishlist.findIndex((item) => item.id === productId);
    if (index !== -1) {
      this.wishlist.splice(index, 1);
      this.updateWishList();
      this.showToast(`تم حذف المنتج من المفضلة❌`, 'error');
    }
  }

  updateWishList() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.wishlistCount.next(this.getTotalQuantity());
  }

  //  إظهار إشعار توست
  private showToast(message: string, type: 'success' | 'info' | 'error') {
    this.snackBar.open(message, 'إغلاق', {
      duration: 3000,
      panelClass:
        type === 'success'
          ? 'snackbar-success'
          : type === 'error'
          ? 'snackbar-error'
          : 'snackbar-info',
      verticalPosition: 'top', // 🔥 يظهر التوست من الأعلى
      horizontalPosition: 'center',
    });
  }
}
