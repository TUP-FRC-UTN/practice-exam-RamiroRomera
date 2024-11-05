import {Component, inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {stockValidator} from "../../validators/sync/stock-validators";
import {OrdersService} from "../../services/orders.service";
import {ProductsService} from "../../services/products.service";
import {Product} from "../../models/product";
import {emailValidator} from "../../validators/async/email-validator";

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
    productos: new FormArray([])
  })

  ngOnInit() {
    console.log("ASDASD")
    this.getAllProducts()
    this.addProducts();
  }

  get productos() {
    return this.orderForm.controls['productos'] as FormArray;
  }

  addProducts() {
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
    if (index < 1) { return; }

    this.productos.removeAt(index)
  }

  onSubmit() {
    console.log(this.orderForm.value);

    if (this.orderForm.valid && this.productos.length <= 10) {
      console.log('Validado');
    }
  }

  getAllProducts() {
    this.productService.getAll().subscribe({
      next: result => { this.productosForSelect = result; },
      error: error => {
        console.log(error)
        alert("Error al obtener los productos.")
      }
    })
  }

  changeProduct(index: number) {
    const moduleControl = this.productos.at(index);
    const selectedType = moduleControl.get('nombreP')?.value;
    const precio = moduleControl.get('precio');
    const stock = moduleControl.get('stock');

    for (let producto of this.productosForSelect) {
      if (producto.id === selectedType.id) {
        precio?.setValue(producto.price);
        stock?.setValue(producto.stock);
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
