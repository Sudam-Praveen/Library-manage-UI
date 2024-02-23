import { Component } from '@angular/core';

import AOS from 'aos'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  ngOnInit() {
    AOS.init({
      duration: 2000
    });
  }
}
