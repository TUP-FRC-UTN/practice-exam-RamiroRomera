import {Component, inject} from '@angular/core';
import {Order} from "../../models/order";
import {OrdersService} from "../../services/orders.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [OrdersService]
})
export class ListComponent {
  private orderService = inject(OrdersService);

  ordersList!:Order[];
  filterOrdersList: Order[] = []
  filterInput!: string;

  ngOnInit() {
    this.orderService.getAll().subscribe({
      next: result => { this.ordersList = result;},
      error: error => console.log(error)
    })
  }

  filterList() {
    if (this.filterInput.length > 0) {
      this.filterOrdersList = []
      for (const order of this.ordersList) {
        if (order.email.match(this.filterInput) || order.customerName.match(this.filterInput)) {
          this.filterOrdersList.push(order);
        }
      }
    } else {
      this.filterOrdersList = []
    }
  }
}
