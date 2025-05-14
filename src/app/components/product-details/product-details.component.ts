import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { ProductService } from '../../services/products/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  name!: string;
  product: any = null;
  mainImage: string = '';
  isLoading: boolean = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishListService: WishlistService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name')!;

    this.productService.getProductsByName(this.name).subscribe({
      next: (data: any) => {
        this.product = data.products?.[0] || data.product || data;

        if (this.product?.images?.length > 0) {
          this.mainImage = this.product.images[0].image;
        } else {
          this.mainImage = ''; // Ensure its empty if no images
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.isLoading = false;
      },
    });
  }

  changeMainImage(newImage: string) {
    if (newImage) {
      this.mainImage = newImage;
    }
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }

  addToWishList(product: any): void {
    this.wishListService.addToWishList(product);
  }
}
