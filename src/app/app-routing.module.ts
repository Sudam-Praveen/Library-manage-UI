import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { ViewAllBooksComponent } from './page/view-all-books/view-all-books.component';
import { SignupComponent } from './page/signup/signup.component';
import { ViewAllBorrowersComponent } from './page/view-all-borrowers/view-all-borrowers.component';
import { HomeComponent } from './page/home/home.component';

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
  },
  {
    path:"view-all-borrowers",
    component:ViewAllBorrowersComponent
  },
  {
    path:"home",
    component:HomeComponent
  },
  {
    path:"",
    redirectTo:"login",
    pathMatch:"full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
