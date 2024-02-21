import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { ViewAllBooksComponent } from './page/view-all-books/view-all-books.component';
import { SignupComponent } from './page/signup/signup.component';

const routes: Routes = [
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"view-all-books",
    component:ViewAllBooksComponent
  },
  {
    path:"signup",
    component:SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
