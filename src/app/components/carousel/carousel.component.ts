import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselService } from '../../services/carousel/carousel.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {
  carouselImages: any[] = [];
  currentIndex = 0;
  interval: any;

  constructor(private carouselService: CarouselService) {}

  ngOnInit(): void {
    this.loadCarouselImages();
  }

  loadCarouselImages(): void {
    const BASE_URL = 'http://127.0.0.1:8000/storage/';

    this.carouselService.getCarouselImages().subscribe(
      (data) => {
        if (data.images) {
          this.carouselImages = data.images.map((img: any) => ({
            ...img,
            image: BASE_URL + img.image,
          }));
          this.startAutoSlide();
        } else {
          console.warn('No images found in API response');
        }
      },
      (error) => {
        console.error('Error fetching carousel images:', error);
      }
    );
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.carouselImages.length) %
      this.carouselImages.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // ngOnInit(): void {
  //   const BASE_URL = 'http://127.0.0.1:8000/storage/'; // تحديث المسار الصحيح

  //   this.carouselService.getCarouselImages().subscribe(
  //     (data) => {
  //       if (data.images) {
  //         this.carouselImages = data.images.map((img: any) => ({
  //           ...img,
  //           image: BASE_URL + img.image, // دمج المسار الصحيح مع الصورة
  //         }));
  //       } else {
  //         console.warn('No images found in API response');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching carousel images:', error);
  //     }
  //   );
  // }
}
