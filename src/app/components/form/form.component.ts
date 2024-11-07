import {Component, inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {stockValidator} from "../../validators/sync/stock-validators";
import {OrdersService} from "../../services/orders.service";
import {ProductsService} from "../../services/products.service";
import {Product} from "../../models/product";
import {Order} from "../../models/order";
import {emailValidator} from "../../validators/async/email-validator";
import {notRepitedProducts} from "../../validators/sync/not-repited-products";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [OrdersService, ProductsService]
})
export class FormComponent {

  private orderService = inject(OrdersService);
  private productService = inject(ProductsService);

  stockP! : number
  productosForSelect! : Product[];

  orderForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.minLength(3), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required], emailValidator(this.orderService)),
    productos: new FormArray([], [notRepitedProducts])
  })

  ngOnInit() {
    this.getAllProducts()
    this.addProducts();
  }

  get productos() {
    return this.orderForm.controls['productos'] as FormArray;
  }

  addProducts() {
    if (this.productos.length > 10) { return; }

    const newModuleForm = new FormGroup({
      nombreP: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      precio: new FormControl(''),
      stock: new FormControl(''),
    });

    newModuleForm.controls["precio"].disable()
    newModuleForm.controls["stock"].disable()

    // newModuleForm.get('nombreP')?.valueChanges.subscribe(value => {
    //   this.changeProduct(this.productos.length - 1);
    // });

    this.productos.push(newModuleForm);
  }

  removeProducts(index: number) {
    if (this.productos.length <= 1) { return; }

    this.productos.removeAt(index)
  }

  onSubmit() {
    if (this.orderForm.valid) {
      let total = 0;
      let products : Product[] = []

      for (const product of this.productos.controls) {
        total += product.get("cantidad")?.value * product.get("precio")?.value
        products.push(product.get("nombreP")?.value)
      }
      total = Math.ceil(total)
      if (total >= 1000) {
        total = total * 0.9
      }
      let code = this.orderForm.controls["nombre"].value.at(0)
      let email = this.orderForm.controls["email"].value
      for (let i = email.length-1; i > email.length - 5; i--) {
        code += email.at(i)
      }
      code += new Date().toISOString()


      let order : Order = {
        customerName: this.orderForm.controls["nombre"].value,
        email: this.orderForm.controls["email"].value,
        total: total,
        orderCode: code,
        timestamp: new Date(),
        products: products
      }

      this.orderService.createOrder(order).subscribe({
        next: response => {alert("Orden creada con exito.")}
      })
    }
  }

  getAllProducts() {
    this.productService.getAll().subscribe({
      next: result => { this.productosForSelect = result; },
      error: error => {
        alert("Error al obtener los productos.")
      }
    })
  }

  changeProduct(index: number) {
    const moduleControl = this.productos.at(index);
    const selectedType = moduleControl.get('nombreP')?.value;
    const cantidad = moduleControl.get('cantidad');
    const precio = moduleControl.get('precio');
    const stock = moduleControl.get('stock');


    for (let producto of this.productosForSelect) {
      if (producto.id === selectedType.id) {
        precio?.setValue(producto.price);
        stock?.setValue(producto.stock);
        this.stockP = producto.stock
        cantidad?.setValidators([stockValidator(this.stockP)]);
        break;
      }
    }
  }

  changeQuantity(index: number) {

    const moduleControl = this.productos.at(index);
    const selectedType = moduleControl.get('nombreP')?.value;
    const cantidad = Number(moduleControl.get('cantidad')?.value);
    const precio = moduleControl.get('precio');
    const stock = moduleControl.get('stock');

    if (cantidad != null || cantidad != undefined) {
      for (let producto of this.productosForSelect) {
        if (producto.id === selectedType.id) {
          precio?.setValue(producto.price.valueOf() * cantidad);
          stock?.setValue(producto.stock.valueOf() - cantidad);
          producto.stock = producto.stock.valueOf() - cantidad
          break;
        }
      }
    }
  }
}
