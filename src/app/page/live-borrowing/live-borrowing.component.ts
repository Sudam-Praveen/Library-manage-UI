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
  public allBorrowedDetails:any;
  public returnedDate:any="";
  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }
  ngOnInit(): void {
    this.loadBorrowedDetails();
  }
  loadBorrowedDetails(){
    this.http.get("http://localhost:8082/borrow/getAll-borrowed-details").subscribe(data=>{
      console.log(data);
      this.allBorrowedDetails=data;
    })
  }

  returnBooks(borrowerDetail:any){
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    
    if(!dateFormatRegex.test(borrowerDetail.returnedDate)){
      alert("date type should be yyyy-mm-dd")
      borrowerDetail.returnedDate=""
    }else{
      alert("good")
    }
  }
}
