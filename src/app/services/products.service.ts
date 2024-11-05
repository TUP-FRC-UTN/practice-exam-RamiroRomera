import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);

  private host = "http://localhost:3000"

  getAll() {
    return this.http.get<Product[]>(`${this.host}/products`)
  }
}
