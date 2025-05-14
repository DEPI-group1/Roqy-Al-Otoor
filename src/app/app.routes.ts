import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ContactComponent } from './components/contact/contact.component';
import { SpecialOffersComponent } from './components/special-offers/special-offers.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OtpVerificationComponent } from './components/auth/otp-verification/otp-verification.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'verify-otp',
    component: OtpVerificationComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'SpecialOffers',
    component: SpecialOffersComponent,
  },
  {
    path: 'product/:name',
    component: ProductDetailsComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'category/:id',
    component: CategoryProductsComponent,
  },
  {
    path: 'checkout',
    component: CheckOutComponent,
  },
  {
    path: 'wishList',
    component: WishlistComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },

  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },

  {
    path: '**',
    redirectTo: '',
  },
];
