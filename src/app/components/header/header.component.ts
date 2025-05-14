import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/products/product.service';
import { CategoryService } from '../../services/category/category.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  wishListCount: number = 0;
  cart: any[] = [];
  categories: any[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    public categoryService: CategoryService,
    public cartService: CartService,
    private wishListService: WishlistService
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count || 0;
    });

    this.wishListService.wishListCount$.subscribe((count) => {
      this.wishListCount = count || 0;
    });

    this.cartService.loadCart(); // ✅ تحميل بيانات السلة
    this.wishListService.loadWishlist(); // ✅ تحميل بيانات المفضلة

    // display Categories dropDown
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }
  addToWishList(product: any): void {
    this.wishListService.addToWishList(product);
  }
  handleProfileClick(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.authService.showToast(`${''} برجاء إنشاء حساب أولا  ❌ `, 'error');
    }
  }
}
