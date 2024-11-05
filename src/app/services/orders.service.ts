import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Order} from "../models/order"

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);

  private host = "http://localhost:3000"

  createOrder(order: Order) {
    return this.http.post<Order>(`${this.host}/orders`, order)
  }

  getEmail(email: string) {
    let params:  HttpParams = new HttpParams()
      .set('email', email)

    return this.http.get<Order>(`${this.host}/orders`, {params})
  }
}
