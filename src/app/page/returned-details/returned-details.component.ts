import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-returned-details',
  templateUrl: './returned-details.component.html',
  styleUrl: './returned-details.component.css'
})
export class ReturnedDetailsComponent implements OnInit {

  private http;
  public allReturnedDetails:any=[];
  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }
  ngOnInit(): void {
    this.loadReturnedDetails()
  }
  loadReturnedDetails(){
    this.http.get("http://localhost:8082/borrow/getAll-returned-details").subscribe(data=>{
      console.log(data);
      this.allReturnedDetails=data;
    })
  }
  searchDetails(key:any){
    console.log(key);
    const results: any[] = [];
    for (const borrowerBook of this.allReturnedDetails) {
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
    this.allReturnedDetails = results;
    if (results.length === 0 || !key) {
      this.loadReturnedDetails();
    }
  }

}
