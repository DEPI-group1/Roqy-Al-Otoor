import { Component } from '@angular/core';
import { ProductService } from '../../services/products/product.service';
import { CategoryService } from '../../services/category/category.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css',
})
export class CategoryProductsComponent {
  categoryId!: string;
  products: any[] = [];

  constructor(
    // بيعرف ان فيه راوت
    // بيعرف ايه المعطيات في الراوت ل فوق
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private cartService: CartService,
    private wishListService: WishlistService
    
  ) {}

  ngOnInit() {
    // السطر ده بيقرأ قيمة الـ ID اللي موجودة في الرابط
    // (اللي اسمه Route Parameter) ويحطها في المتغير categoryId.
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    // snapghot => بتاخد نسخه من الباراميترز
    // ! => (non-null assertion operator) =>"أنا متأكد إن القيمة دي مش null أو undefined
    // يعني انا ضامن ال ID موجود
    this.categoryService
      .getProductsByCategory(this.categoryId)
      .subscribe((data: any) => {
        this.products = Array.isArray(data.products)
          ? data.products
          : Object.values(data.products);
        console.log(this.products); // تأكد إنها اتعبّت صح
      });
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    // يمكنك إضافة رسالة تأكيد هنا
  }

  addToWishList(product: any): void {
    this.wishListService.addToWishList(product);
    // يمكنك إضافة رسالة تأكيد هنا
  }
}
