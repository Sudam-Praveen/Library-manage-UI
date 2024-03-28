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

  public isExistsInBorrowedList: any = "";



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

      //-------------first checking that borrower already borrowed the books-------
      this.http.get(`http://localhost:8082/borrow/find-exists-in-borrowedList/${this.userName}`).subscribe(data => {
        console.log(data);
        this.isExistsInBorrowedList = data;
        if (this.isExistsInBorrowedList == true) {
          console.log("exists");
          Swal.fire({
            title: "This user has Borrowed Books",
            html: `Please Return the books for New Borrowing!`,
            icon: "error"
          });
          return
        } else {
          //--------------if not borrowed he can get the books---------
          console.log("not exists");
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
      });
      this.isExistsInBorrowedList = ''
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

            if(this.searchedBook.qty == 0){

                Swal.fire({
                  title: "Zero QTY ",
                  html: `"${this.searchedBook.title}"Book Must be returned ! `,
                  icon: "error"
                });
                return
              
            }
            if (this.cartList.length == 0) {
              this.cartList.push(this.searchedBook)
            } else if (this.cartList.length == 2) {

              Swal.fire({
                title: "Two-Book Limit ! ",
                html: `You can only borrow two books!`,
                icon: "error"
              });
              return
            }else {
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
  bookTitles: any = [];
  loadBookIds() {
    this.cartList.forEach((element: any) => {
     
      this.bookTitles.push(element.title)
      this.bookIDs.push(element.id)
      element.qty--;
      //--------reduce qty when borrowing
      this.http.put("http://localhost:8080/book/update", element)
        .subscribe(data => {
          console.log("Updated the qty ");
          console.log(data);
        })
    

    
  });
  }

  borrowBooks() {
    this.loadBookIds();

   
  //-------------- call the confirmation to proceed the borrowing--------
    const borrowBook: any = {
      borrowerID: this.user.id,
      borrowerName: this.user.userName,
      borrowerEmail: this.user.email,
      books: this.bookIDs,
      bookTitles: this.bookTitles,
      date: new Date().toISOString().split('T')[0],
      status: "borrowed",
      fine: ""

    }
    Swal.fire({
      title: "Are you sure to Borrow these Books?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {

        console.log(borrowBook);
        this.http.post("http://localhost:8082/borrow/add-borrow-details", borrowBook).subscribe(data => {
          console.log(data);

        })
        Swal.fire({
          title: "Completed!",
          text: "Borrowing Transaction completed!",
          html: "Books Must be returned within two weeks :)",
          icon: "success"
        });
      }
    });


  }

}


