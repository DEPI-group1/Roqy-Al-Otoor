import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getWishlistItems();
  }

  getWishlistItems() {
    this.wishlist = this.wishlistService.getWishlistItems();
  }

  removeFromWishlist(productId: number) {
    this.wishlistService.deleteWishListItemById(productId);
    this.getWishlistItems(); // ✅ تحديث القائمة بعد الحذف
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }
}
