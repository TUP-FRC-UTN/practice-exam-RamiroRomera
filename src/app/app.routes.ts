import { Routes } from '@angular/router';
import {FormComponent} from "./components/form/form.component";
import {ListComponent} from "./components/list/list.component";

export const routes: Routes = [
  {path: "create-order", component: FormComponent},
  {path: "orders", component: ListComponent}
];
