import {Product} from "./product";

export interface Order {
  id: number;
  customerName: string;
  email: string;
  total: number;
  orderCode: number;
  timestamp: Date;
  products: Product[];
}
