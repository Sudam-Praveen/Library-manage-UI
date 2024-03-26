import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-borrow-books',
  templateUrl: './borrow-books.component.html',
  styleUrl: './borrow-books.component.css'
})
export class BorrowBooksComponent implements OnInit {
  private http;
  public userName: string = ''
  public user: any;

  public borrowbook: any = {
    userID: "",
    bookId: "",
    Date: new Date(),
    fine: "",
    qty: ""
  }

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }
  ngOnInit(): void {

  }
  searchUser() {
    if (this.userName == '' || this.userName == null) {
      Swal.fire({
        title: "User Name is Empty",
        html: `Enter Borrower's <b>username<b>!`,
        icon: "error"
      });
    } else {
      console.log(this.userName)
      this.http.get(`http://localhost:8081/borrower/find-UserName/${this.userName}`).subscribe(data => {
        console.log(data);

        if (data == null) {
          Swal.fire({
            title: "Invalid User Name ",
            html: `Check and Re-enter Borrower's <b>username<b>!`,
            icon: "error"
          });
        } else {
          this.user = data;
          this.userName = ''
        }

      })
    }


  }

}
