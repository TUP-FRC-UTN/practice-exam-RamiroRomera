import { AbstractControl, ValidationErrors } from "@angular/forms";

export function stockValidator(control: AbstractControl, productStock: number): ValidationErrors | null {

  if (control.parent) {
    return null;
  }

  const stock = control.value;
  console.log(stock);

  if (stock <= productStock) {
    return null;
  } else {
    return { stockInsuficiente : true }
  }
}
