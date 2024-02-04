import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-view-all-books',
  templateUrl: './view-all-books.component.html',
  styleUrl: './view-all-books.component.css'
})
export class ViewAllBooksComponent {
  public http;
  public bookList:any ;
  public selectedBook:any;
  

  constructor(private httpClient:HttpClient){
    this.http=httpClient;
  }
  //auto calling when component loading(life cycle)
  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(){
    this.http.get("http://localhost:8080/book/all")
    .subscribe(data =>{
      console.log(data);
      this.bookList=data;
    });
  }

  setSelectedBook(Book:any){
    this.selectedBook=Book;
  }

  removeBook(){
    this.http.delete("http://localhost:8080/student/" + this.selectedBook.id)
    .subscribe(data => {
      console.log(data);
      this.loadBooks();
      this.selectedBook=null;
    })
  }

}
