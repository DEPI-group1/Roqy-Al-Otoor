import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  orders: any[] = [];
  constructor(private ordersService: OrdersService) {
    // this.loadorders();
  }

  ngOnInit() {
    this.ordersService.getOrders().subscribe({
      next: (res) => {
        console.log('استجابة الخادم:', res); // قم بتسجيل الاستجابة
        if (Array.isArray(res.orders)) {
          this.orders = res.orders;
        } else {
          console.error('البيانات ليست مصفوفة:', res.orders);
        }
      },
      error: (err) => {
        console.error('فشل في تحميل الطلبات:', err);
      },
    });
  }

  // loadorders() {
  //   this.ordersService.getOrders().subscribe({
  //     next: (data) => {
  //       this.orders = data;
  //       console.log('User Data: ', data);
  //     },
  //     error: (err) => {
  //       console.error('Error Fetching Orders Data: ', err);
  //     },
  //   });
  // }
}
