import { Component, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ProductsComponent } from './components/products/products.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { FooterComponent } from './components/footer/footer.component';

declare var Swiper: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    HeaderComponent,
    CarouselComponent,
    ProductsComponent,
    BottomNavComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent{
  // implements AfterViewChecked {
  private swiperInitialized: boolean = false;

  // ngAfterViewChecked() {
  //   if (!this.swiperInitialized) {
  //     new Swiper('.swiper', {
  //       slidesPerView: 3,
  //       spaceBetween: 10,
  //       pagination: {
  //         el: '.swiper-pagination',
  //         clickable: true,
  //       },
  //       breakpoints: {
  //         280: {
  //           slidesPerView: 1.5,
  //         },
  //         360: {
  //           slidesPerView: 2.2,
  //         },
  //         480: {
  //           slidesPerView: 2.9,
  //         },
  //         640: {
  //           slidesPerView: 3.5,
  //         }
  //         // },
  //         // 768: {
  //         //   slidesPerView: 4,
  //         // },
  //         // 1024: {
  //         //   slidesPerView: 5,
  //         // }
  //         // },
  //         // 1280: {
  //         //   slidesPerView: 6,
  //         // },
  //         // 1440: {
  //         //   slidesPerView: 7,
  //         // },
  //         // 1600: {
  //         //   slidesPerView: 8,
  //         // },
  //         // 1920: {
  //         //   slidesPerView: 9,
  //         // },
  //       },
  //     });
  //     this.swiperInitialized = true; // Ensure Swiper initializes only once
  //   }
  // }

  title = '';
  currentUrl: string = '/';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url; // تحديث المسار الحالي عند تغيير الصفحة
    });
  }
}
