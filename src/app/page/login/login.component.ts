import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import AOS from 'aos'
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private http;
  constructor(httpclient:HttpClient){
    this.http=httpclient;
  }

  ngOnInit() {
    AOS.init({
      duration: 2000
    });
  }

  public admin = {
    email: null,
    password: null
  }
  logIn() {
    // Login Validation
    if (this.admin.email == null || this.admin.email == "" || !/\w+@\w+\.\w+/.test(this.admin.email)) {
      Swal.fire({
        title: "Login Error !",
        text: "Enter Valid email?",
        icon: "error"
      });
      return
    } else if (this.admin.password == null || this.admin.password == "") {
      Swal.fire({
        title: "Login Error",
        text: "Enter password?",
        icon: "error"
      });
      return
    } else {

      //check the email and pw valid from the DB
        this.http.put('http://localhost:8080/login/check',this.admin)

      console.log(this.admin)
    }
  }
}
