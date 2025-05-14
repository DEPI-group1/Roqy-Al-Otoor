import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiURL } from '../../constants/api';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // private apiURL = 'http://127.0.0.1:8000/api';
  // private apiURL = 'https://0609-197-135-192-231.ngrok-free.app/api';
  constructor(private http: HttpClient) {}

  // Method To Get Categories From API
  getCategories(): Observable<any[]> {
    // const headers = new HttpHeaders({
    //   'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
    //   'User-Agent': 'Custom User Agent', // Custom User-Agent header
    // });
    return this.http.get<any>(`${apiURL}/categories`).pipe(
      //  pipe => بتاخد مني داتا بشكل وتخرجها بشكل تاني يعني بتعمل تحويل لفورمات الداتا
      map((response) => response.categories) //بترجعلي الداتا على شكل مصفوفة map
    );
  }

  // Method To Get Category Products From API
  getProductsByCategory(id: string): Observable<any[]> {
    // const headers = new HttpHeaders({
    //   'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
    //   'User-Agent': 'Custom User Agent', // Custom User-Agent header
    // });

    return this.http.get<any[]>(`${apiURL}/products/category/${id}`);
  }
}
