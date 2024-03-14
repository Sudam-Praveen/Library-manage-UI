import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import AOS from 'aos'
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private http;
  constructor(httpclient: HttpClient, private router: Router) {
    this.http = httpclient;
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
      this.http.put(`http://localhost:8080/login/check`, this.admin, { responseType: 'text' })
        .subscribe((data: any) => {
          Swal.fire({
            title: 'Welcome!',
            html: `  User `,
            icon: 'success'
          }).then(() => {
            // Navigate to home component upon successful login
            this.router.navigate(['/view-all-borrowers']);
          });
        },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              html: 'Invalid Login please check the email & password',
              icon: 'error'
            });
          }
        )


    }
  }
}
