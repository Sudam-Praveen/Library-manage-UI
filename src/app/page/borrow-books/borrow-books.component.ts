import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ɵprovideZonelessChangeDetection } from '@angular/core';
import Swal from 'sweetalert2';
import AOS from 'aos'
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
        title: "Book Id Not Entered ",
        html: `Enter Book ID without <b>"#BN"<b>!`,
        icon: "error"
      });
    } else {

      this.http.get(`http://localhost:8080/book/search/${this.bookId}`).subscribe(data => {
        console.log(data)
        this.searchedBook = data;

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
              this.cartList.push(this.searchedBook)
            } else if (this.cartList.length == 2) {

              Swal.fire({
                title: "Two-Book Limit ",
                html: `You can only borrow two books!`,
                icon: "error"
              });
              return
            } else {
              var i;
              for (i in this.cartList) {
                if (this.cartList[i].id == this.searchedBook.id) {

                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `The book "${this.cartList[i].title}" is already added!`,
                    showConfirmButton: false,
                    timer: 2500
                  });

                  console.log("exists")
                  return

                } else {
                  isExists = false
                  console.log("not Exists")
                }
              }
            }
            if (isExists == false && this.cartList.length < 2) {
              this.cartList.push(this.searchedBook);
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
  //----------delete a book from cartList--------------

  deleteBookItem(id: any) {

    const indexNum = this.cartList.findIndex((item: any) => item.id === id);
    console.log(indexNum)
    this.cartList.splice(indexNum, 1);
    console.log("Delete from the cart - ");
    console.log(this.cartList);


  }

  //-------------------borrow books------------

  bookIDs: any = [];
  loadBookIds() {
    this.cartList.forEach((element: any) => {
      if (element.qty == 0) {
        Swal.fire({
          title: "Zero QTY ",
          html: `Books Must be returned ! `,
          icon: "error"
        });
      } else {

        this.bookIDs.push(element.id)
        element.qty--;
        //--------reduce qty when borrowing
        this.http.put("http://localhost:8080/book/update", element)
          .subscribe(data => {
            console.log("Update the qty- ");
            console.log(data);

          })
      }
    });
    console.log("bookids" + this.bookIDs)
  }

  borrowBooks() {
    this.loadBookIds()

    const borrowBook: any = {
      borrowerID: this.user.id,
      books: this.bookIDs,
      date: new Date().toISOString().split('T')[0],
      fine: "",
    }

    console.log(borrowBook);
    this.http.post("http://localhost:8082/borrow/add-borrow-details", borrowBook).subscribe(data => {
      console.log(data);
    })

  }

}

