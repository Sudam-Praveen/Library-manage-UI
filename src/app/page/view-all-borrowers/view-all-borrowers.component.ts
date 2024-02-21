import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-view-all-borrowers',
  templateUrl: './view-all-borrowers.component.html',
  styleUrl: './view-all-borrowers.component.css'
})
export class ViewAllBorrowersComponent implements OnInit {

  private http;
  public allBorrowersList:any;
  constructor(httpClient:HttpClient){
    this.http=httpClient;
  }

  ngOnInit(): void {
    this.loadBorrowers();
  }
  loadBorrowers(){
    this.http.get("http://localhost:8081/borrower/all").subscribe(data=>{
      console.log(data);
      this.allBorrowersList=data;
    })
  }

}
