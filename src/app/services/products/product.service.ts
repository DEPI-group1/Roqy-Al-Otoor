import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiURL } from '../../constants/api';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // Method To Get Products From API
  getProducts(): Observable<any[]> {
    // const headers = new HttpHeaders({
    //   'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
    //   'User-Agent': 'Custom User Agent', // Custom User-Agent header
    // });
    return this.http.get<any>(`${apiURL}/products`).pipe(
      map((response) => response.products) // إرجاع المصفوفة فقط
    );
  }

  // Method To Get Category Products From API
  getProductsByName(name: string): Observable<any[]> {
    // const headers = new HttpHeaders({
    //   'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
    //   'User-Agent': 'Custom User Agent', // Custom User-Agent header
    // });
    return this.http.get<any[]>(`${apiURL}/products/${name}`);
  }
}
