import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map, switchMap, timer, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {OrdersService} from "../../services/orders.service";


export const emailValidator = (service: OrdersService): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.parent) {
      return of(null);
    }

    const email = control.parent.get('email')?.value;

    if (!email) {
      return of(null);
    }

    // service.getEmail(email).subscribe({
    //   next: result => {
    //     if (result.email === null) {
    //       return null;
    //     }  else {
    //       return of({ emailExists: true });
    //     }
    //
    //   },
    //   error: error => console.log(error)
    // })

    return timer(1000).pipe(
      switchMap(() =>
        service.getEmail(email).pipe(
          map(() => {
            console.log("ASDASd")
            return of({ emailExists: true });
          })
        )
      )
    );
  }
}
