import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent {
  originalPrice: number = 0; 
  finalPrice: number = 0; 
  savedFinalPrice: number = 0;
  savedOriginalPrice: any;
  discount: any;

  constructor(
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.loadSavedPrices();
  }

  loadSavedPrices() {
    const savedOriginalPrice = this.cartService.getSubtotal(); 
    const discountString = localStorage.getItem('discount');

    this.savedOriginalPrice = savedOriginalPrice;
    this.discount = discountString ? parseFloat(discountString) : 0;

    this.savedFinalPrice = this.savedOriginalPrice - this.discount;

    console.log('originalSubtotal:', this.savedOriginalPrice);
    console.log('totalAfterDiscount:', this.savedFinalPrice);

    if (this.savedOriginalPrice) {
      this.originalPrice = parseFloat(this.savedOriginalPrice);
    }

    if (this.savedFinalPrice) {
      this.finalPrice = this.savedFinalPrice;
    }
  }
}
