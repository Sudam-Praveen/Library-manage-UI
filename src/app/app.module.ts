import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './common/nav/nav.component';
import { ViewAllBooksComponent } from './page/view-all-books/view-all-books.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './page/login/login.component';
import { SignupComponent } from './page/signup/signup.component';
import { ViewAllBorrowersComponent } from './page/view-all-borrowers/view-all-borrowers.component';
import { HomeComponent } from './page/home/home.component';
import { BorrowBooksComponent } from './page/borrow-books/borrow-books.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ViewAllBooksComponent,
    LoginComponent,
    SignupComponent,
    ViewAllBorrowersComponent,
    HomeComponent,
    BorrowBooksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
