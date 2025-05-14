import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from '../../constants/api';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  constructor(private http: HttpClient) {}

  getCarouselImages(): Observable<any> {
    return this.http.get<any>(`${apiURL}/images`);
  }
}
