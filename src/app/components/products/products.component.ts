import { Component, OnInit, OnDestroy } from '@angular/core'; // هنا بنستورد الكلاسات الأساسية من Angular علشان نستخدمها في الكومبوننت.
import { CommonModule } from '@angular/common'; // بنستورد CommonModule عشان نقدر نستخدمه في الكومبوننت.
import { RouterModule } from '@angular/router'; // بنستورد RouterModule علشان نقدر نعمل تنقل بين الصفحات في التطبيق.
import { ProductService } from '../../services/products/product.service'; // دي خدمة المنتجات، بنستخدمها علشان نجيب البيانات من السيرفر.
import { CartService } from '../../services/cart/cart.service'; // دي خدمة السلة، بنستخدمها علشان نضيف منتجات للسلة.
import { WishlistService } from '../../services/wishlist/wishlist.service'; // دي خدمة المفضلة، بنستخدمها علشان نضيف منتجات للمفضلة.
import { Subscription } from 'rxjs'; // هنا بنستورد Subscription علشان نتابع التغييرات اللي بتحصل في الـ observables.
import Swiper from 'swiper'; // هنا بنستورد مكتبة Swiper علشان نعرض المنتجات في سلايدر.
import { SwiperOptions } from 'swiper/types'; // بنستورد النوع الخاص بإعدادات Swiper علشان نقدر نضبط السلايدر.
import 'swiper/css'; // بنستورد الـ CSS الخاص بمكتبة Swiper.
import { AuthService } from '../../services/auth/auth.service'; // دي خدمة التوثيق، بنستخدمها علشان نعرف إذا كان المستخدم مسجل دخول ولا لأ.
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products', // ده اسم الكومبوننت في الـ HTML.
  standalone: true, // بنخلي الكومبوننت ده مستقل عشان نقدر نستخدمه لوحده.
  imports: [CommonModule, RouterModule, FormsModule], // بنستورد الـ modules اللي هنحتاجها هنا.
  templateUrl: './products.component.html', // رابط ملف الـ HTML الخاص بالكومبوننت.
  styleUrls: ['./products.component.css'], // رابط ملف الـ CSS الخاص بالكومبوننت.
})
export class ProductsComponent implements OnInit, OnDestroy {
  // هنا بنبدأ الكلاس بتاع الكومبوننت.
  products: any[] = []; // دي مصفوفة هتحتفظ بكل المنتجات اللي هتيجي من الـ API.
  filteredProducts: any[] = []; // دي مصفوفة هتحتفظ بالمنتجات بعد ما نعمل عليها فلترة (يعني لو في بحث أو تصنيف).
  isLoading: boolean = true; // هنا بنحدد إذا كان البيانات لسه شغالة في التحميل ولا لأ.
  errorMessage: string = ''; // لو حصل خطأ أثناء جلب المنتجات، الرسالة دي هتظهر.
  private productsSubscription!: Subscription; // هنا بنحفظ الاشتراك اللي هنستخدمه علشان نتفاعل مع الـ observable اللي جاي من الـ API.
  swiper?: Swiper; // بنحجز متغير لـ Swiper علشان نقدر نستخدمه بعدين في الكود.

  // الإعدادات الخاصة بـ Swiper
  swiperConfig: SwiperOptions = {
    slidesPerView: 2.5, // عدد المنتجات اللي هتظهر في كل شريحة من السلايدر.
    spaceBetween: 8, // المسافة بين كل منتج والتاني.
    loop: true, // بنخلي السلايدر يلف بشكل مستمر بدون توقف.
    breakpoints: {
      // إعدادات لعرض السلايدر بشكل مختلف على الشاشات المختلفة.
      280: { slidesPerView: 1.5 }, // الشاشات الصغيرة (أقل من 280px)
      360: { slidesPerView: 2 }, // الشاشات الأكبر من 280px
      480: { slidesPerView: 2.4 },
      640: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 4.8 },
      1280: { slidesPerView: 6 },
      1440: { slidesPerView: 6.8 },
      1600: { slidesPerView: 7.8 },
      1920: { slidesPerView: 9.8 }, // الشاشات الكبيرة.
    },
  };

  constructor(
    public authService: AuthService, // خدمة التوثيق اللي بتدير تسجيل الدخول والخروج.
    private productService: ProductService, // خدمة المنتجات اللي بتجيب البيانات من السيرفر.
    private cartService: CartService, // خدمة السلة اللي بنضيف فيها المنتجات.
    private wishListService: WishlistService // خدمة المفضلة.
  ) {}

  ngOnInit(): void {
    // دالة ngOnInit بتشتغل أول ما الكومبوننت يتعمل initial loading.
    this.loadProducts(); // بندي الأمر بتحميل المنتجات.
  }

  ngOnDestroy(): void {
    // دالة ngOnDestroy بتشتغل لما الكومبوننت يتدمر.
    if (this.productsSubscription) {
      // لو فيه اشتراك لسه شغال.
      this.productsSubscription.unsubscribe(); // نقفل الاشتراك ده عشان نمنع تسريب الذاكرة.
    }
    if (this.swiper) {
      // لو فيه Swiper متعرف.
      this.swiper.destroy(); // نقفل الـ Swiper.
    }
  }

  // دالة لحساب الخصم وتخزينه
  private calculateDiscountPercentage(
    originalPrice: number, // السعر الأصلي
    discountPrice: number // السعر بعد الخصم
  ): number {
    const discountPercentage =
      ((originalPrice - discountPrice) / originalPrice) * 100; // الحساب الفعلي لنسبة الخصم.
    return Math.round(discountPercentage); // نرجع النسبة بعد ما نقرّبها لأقرب عدد صحيح.
  }

  private loadProducts(): void {
    // دالة لتحميل المنتجات.
    this.isLoading = true; // بنخلي حالة التحميل تكون مفعلة.
    this.errorMessage = ''; // بنمسح أي رسالة خطأ سابقة.

    this.productsSubscription = this.productService.getProducts().subscribe({
      // بنشترك في خدمة المنتجات.
      next: (data: any[]) => {
        // لما البيانات تجيبها الخدمة.
        this.products = data.map((product) => {
          // بنمر على كل منتج ونحسب الخصم لو فيه.
          if (product.old_price && product.price) {
            // لو فيه سعر قديم وسعر جديد.
            product.discountPercentage = this.calculateDiscountPercentage(
              // بنحسب نسبة الخصم.
              product.old_price,
              product.price
            );
          } else {
            product.discountPercentage = 0; // لو مفيش خصم.
          }
          return product;
        });
        this.filteredProducts = [...data]; // بننسخ المنتجات بعد الحسابات.
        this.isLoading = false; // بنخلي حالة التحميل مش شغالة.
        this.initSwiper(); // بنبدأ Swiper.
      },
      error: (error) => {
        // لو حصل خطأ أثناء جلب البيانات.
        console.error('Error loading products:', error); // بنطبع الخطأ في الكونسول.
        this.errorMessage = 'حدث خطأ أثناء جلب المنتجات. يرجى المحاولة لاحقاً.'; // بنعرض رسالة الخطأ.
        this.isLoading = false; // بنوقف التحميل.
      },
    });
  }

  // دالة لبدء Swiper بعد تحميل البيانات
  private initSwiper(): void {
    setTimeout(() => {
      // بنأخر تنفيذ الـ swiper شوية علشان يشتغل بعد تحميل كل البيانات.
      this.swiper = new Swiper('.core-swiper-container', this.swiperConfig); // بنبدأ Swiper بالإعدادات اللي عرفناها.
    }, 0);
  }

  // دالة لإضافة منتج للسلة
  addToCart(product: any): void {
    this.cartService.addToCart(product); // بنضيف المنتج للسلة.
  }

  // دالة لإضافة منتج للمفضلة
  addToWishList(product: any): void {
    this.wishListService.addToWishList(product); // بنضيف المنتج للمفضلة.
  }

  // دالة للبحث عن المنتجات حسب كلمة البحث
  searchProducts(term: string): void {
    this.filteredProducts = this.products.filter(
      // بنعمل فلترة للمنتجات حسب الكلمة اللي دخلها المستخدم.
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) || // إذا كانت الكلمة موجودة في اسم المنتج.
        product.description.toLowerCase().includes(term.toLowerCase()) // أو في وصف المنتج.
    );
  }
}
