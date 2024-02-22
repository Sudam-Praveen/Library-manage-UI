import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-view-all-books',
  templateUrl: './view-all-books.component.html',
  styleUrl: './view-all-books.component.css'
})
export class ViewAllBooksComponent implements OnInit {
  public http;
  public bookList: any;
  public selectedBook: any;


  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }
  //auto calling when component loading(life cycle)
  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.http.get("http://localhost:8080/book/all")
      .subscribe(data => {
        console.log(data);
        this.bookList = data;
      });
  }

  setSelectedBook(Book: any) {
    this.selectedBook = Book;
  }

  removeBook() {
    this.http.delete(`http://localhost:8080/book/delete/${this.selectedBook.id}`, { responseType: 'text' })
      .subscribe(data => {
        console.log(data);


        Swal.fire({
          title: "Deleted!",
          html: `The book <b style="color: red;">"${this.selectedBook.title}"</b>  is deleted`,
          icon: "success"
        });
        this.selectedBook = null;
        this.loadBooks();
      }, error => {
        console.error("Error deleting book:", error);
      })
  }

  updateBook() {

    this.http.post("http://localhost:8080/book/add", this.selectedBook)
      .subscribe(data => {
        console.log(data);
        Swal.fire({
          title: "Updated!",
          html: `The book <b>${this.selectedBook.title}</b> is updated`,
          icon: "success"
        });
        this.selectedBook = null;
        this.loadBooks();
      })
  }


  public book = {
    isbn:null,
    title:null,
    author:null,
    category:null,
    qty:null


  }

  addBook() {
    this.http.post("http://localhost:8080/book/add",this.book).subscribe(data => {
      console.log(data);
      Swal.fire({
        title: "Added!",
        html: `The book <b>${this.book.title}</b> is Addedd`,
        icon: "success"
      });
      this.loadBooks();
    })
  }
  public searchBook(key: string) {
    console.log(key);
    const results: any[] = [];
    for (const book of this.bookList) {
      if (book.isbn.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || book.title.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || book.author.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || book.category.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(book);
      }
    }
    this.bookList = results;
    if (results.length === 0 || !key) {
      this.loadBooks();
    }
  }

}
