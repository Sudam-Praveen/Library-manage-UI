import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ɵprovideZonelessChangeDetection } from '@angular/core';
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

  public bookId: any;
  public searchedBook: any = {};

  public newSearchedBook: any = {}

  public bookQty: any = 1;

  public borrowbook: any = {
    userID: "",
    bookId: "",
    Date: new Date(),
    fine: "",
    qty: ""
  }

  public cartList: any = []

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




  searchBook() {
    
    if (this.bookId == '' || this.bookId == null) {
      Swal.fire({
        title: "Invalid Input",
        html: `Enter Book ID without <b>"#BN"<b>!`,
        icon: "error"
      });
    } else {

      this.http.get(`http://localhost:8080/book/search/${this.bookId}`).subscribe(data => {
        console.log(data)
        this.searchedBook = data;

        this.newSearchedBook = {
          id: this.searchedBook.id,
          isbn: this.searchedBook.isbn,
          title: this.searchedBook.title,
          author: this.searchedBook.author,
          category: this.searchedBook.category,
          qty: 1

        }

        Swal.fire({
          title: `<b style="color: blue;">"${this.searchedBook.title}"</b> <br> Do you want to get this book?`,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          denyButtonText: `Don't `
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            let isExists = true;

            if (this.cartList.length == 0) {
              this.cartList.push(this.newSearchedBook)
            } else {
              var i;
              for (i in this.cartList) {
                if (this.cartList[i].id == this.searchedBook.id) {
                  this.cartList[i].qty++;
                  console.log("exists")
                  return
                } else {
                  isExists = false
                  console.log("not Exists")
                }
              }
            }
            if (isExists == false) {
              this.cartList.push(this.newSearchedBook);
            }


            this.searchedBook = null;
            Swal.fire("Added!", "", "success");

            console.log(this.cartList)
          } else if (result.isDenied) {
            Swal.fire("The Book not added", "", "info");
          }
        });

        this.bookId = '';

      }, error => {
        Swal.fire({
          title: "Invalid Book Id ",
          html: `Check and Re-enter Book ID without <b>"#BN"<b> ! `,
          icon: "error"
        });
      })
    }


  }

}

