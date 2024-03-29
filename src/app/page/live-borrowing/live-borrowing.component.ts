import { HttpClient } from '@angular/common/http';
import { compileNgModule } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import AOS from 'aos'
@Component({
  selector: 'app-live-borrowing',
  templateUrl: './live-borrowing.component.html',
  styleUrl: './live-borrowing.component.css'
})
export class LiveBorrowingComponent implements OnInit {

  private http;
  public allBorrowedDetails: any=[];
  public returnedDate: any = "";
  public selectedDetailObject: any;
  public fineValue: any;
  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }
  ngOnInit() {
    this.loadBorrowedDetails();
  }
  loadBorrowedDetails() {
    this.http.get("http://localhost:8082/borrow/getAll-borrowed-details").subscribe(data => {
      console.log(data);
      this.allBorrowedDetails = data;
    })
  }


  updateQty(book: any) {
    book.qty++;
    this.http.put("http://localhost:8080/book/update", book)
      .subscribe(data => {
        console.log("increasing qty");
        
        console.log(data);

      })
  }

  increaseBookQty() {
    const bookIDArray: any = this.selectedDetailObject.books;
    console.log(bookIDArray);
    bookIDArray.forEach((element: any) => {
      
      this.http.get(` http://localhost:8080/book/search/${element}`)
        .subscribe(data => {
          console.log(data);
          this.updateQty(data)
        });
    });
  }

  returnBooks(borrowerDetail: any) {

    this.selectedDetailObject = borrowerDetail;
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;


    if (!dateFormatRegex.test(borrowerDetail.returnedDate)) {
      Swal.fire({
        title: "Invalid Date!",
        html: "Please enter the date in yyyy-mm-dd format.",
        icon: "error"
      });
      borrowerDetail.returnedDate = ""
    } else {
      console.log(borrowerDetail);
      this.http.post("http://localhost:8082/borrow/find-the-fine", this.selectedDetailObject).subscribe(data => {
        console.log(data);
        this.fineValue = data;

        if (this.fineValue > 0) {
          Swal.fire({
            title: "Fine Applicable !",
            html: `Have a Fine of <b style="color: red;">"RS.${this.fineValue}.00"</b> up to date! `,
            showCancelButton: true,
            confirmButtonText: "Pay & Return"

          }).then((result) => {

            if (result.isConfirmed) {
              this.selectedDetailObject.status = "returned";
              this.selectedDetailObject.fine = this.fineValue;
              //increase the book qty in allbooks
              this.increaseBookQty();
              this.http.post("http://localhost:8082/borrow/add-borrow-details", this.selectedDetailObject).subscribe(data => {
                console.log(data);
                this.loadBorrowedDetails()
              })
             
              Swal.fire("Book(s) Returned !", "", "success");
              this.selectedDetailObject.returnedDate = ""


            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          });
        } else {

          Swal.fire({
            title: "No Fine Applicable !",
            html: `Book(s) Can be Returned :) `,
            showCancelButton: true,
            confirmButtonText: "Return Book(s)"

          }).then((result) => {

            if (result.isConfirmed) {
              this.selectedDetailObject.status = "returned";
              this.selectedDetailObject.fine = this.fineValue;
              //increase the book qty in allbooks
              this.increaseBookQty()
              this.http.post("http://localhost:8082/borrow/add-borrow-details", this.selectedDetailObject).subscribe(data => {
                console.log(data);
                this.loadBorrowedDetails()
              })
             
              Swal.fire("Book(s) Returned !", "", "success");
              this.selectedDetailObject.returnedDate = ""

            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          });

        }

      })
    }
  }



  //-------------------Search Details-------------------------
  public searchDetails(key: string){
    console.log(key);
    const results: any[] = [];
    for (const borrowerBook of this.allBorrowedDetails) {
      // Check if borrowerName or borrowerID matches the key
      if (borrowerBook.borrowerName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || (borrowerBook.borrowerID && typeof borrowerBook.borrowerID === 'string' && borrowerBook.borrowerID.toLowerCase().indexOf(key.toLowerCase()) !== -1)) {
        results.push(borrowerBook);
      } else {
        // Check if any book title matches the key
        for (const title of borrowerBook.bookTitles) {
          if (title.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            results.push(borrowerBook);
            break; // Break out of the loop if a match is found for this borrowerBook
          }
        }
      }
    }
    this.allBorrowedDetails = results;
    if (results.length === 0 || !key) {
      this.loadBorrowedDetails();
    }
  }
  
}
