import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-view-all-borrowers',
  templateUrl: './view-all-borrowers.component.html',
  styleUrl: './view-all-borrowers.component.css'
})
export class ViewAllBorrowersComponent implements OnInit {

  private selectedGender: string;
  private http;
  public allBorrowersList: any;
  public response: any;
  public selectedBorrower: any

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
    this.selectedGender = "";
  }

  ngOnInit(): void {
    this.loadBorrowers();
  }

  loadBorrowers() {
    this.http.get("http://localhost:8081/borrower/all").subscribe(data => {
      console.log(data);
      this.allBorrowersList = data;
    })
  }

  public borrower = {
    firstName: null,
    lastName: null,
    email: null,
    address: null,
    doB: null,
    gender: null as string | null,
    contactNumber: ''
  }
  clearFields() {
    this.borrower = {
      firstName: null,
      lastName: null,
      email: null,
      address: null,
      doB: null,
      gender: null as string | null,
      contactNumber: ''
    }
  }
  genderSelect(value: string) {
    if (value !== null) {
      this.borrower.gender = value;
    }
  }

  addBorrower() {

    if (this.borrower.contactNumber && this.borrower.contactNumber.length !== 10) {
      Swal.fire({
        title: "Invalid Phone Number!",
        html: `please <b>Recheck</b> phone Number!`,
        icon: "error"
      });
      console.log("Contact Number:", this.borrower.contactNumber);

    } else {

      this.http.post("http://localhost:8081/borrower/add", this.borrower).subscribe(data => {
        console.log(data);
        if (data == null) {
          Swal.fire({
            title: "Available Person!",
            html: `This <b>${this.borrower.contactNumber}</b> Number is Available please <b>Update</b>!`,
            icon: "error"
          });
        } else {
          console.log(data);
          this.response = data;
          Swal.fire({
            title: "Added!",
            html: ` <b>${this.borrower.firstName}</b> is Addedd ! <br> Register Number is <b>${this.response.registerNo}</b>`,
            icon: "success"
          });
          this.clearFields();
          this.loadBorrowers();
        }


      })

    }

  }

  setSelectedBorrower(Borrower: any) {
    this.selectedBorrower = Borrower;
  }
  removeBorrower() {
    this.http.delete(`http://localhost:8081/borrower/delete/${this.selectedBorrower.id}`, { responseType: 'text' })
      .subscribe(data => {
        console.log(data);


        Swal.fire({
          title: "Deleted!",
          html: `The Borrower <b style="color: red;">"${this.selectedBorrower.firstName}"</b>  is deleted`,
          icon: "success"
        });
        this.selectedBorrower = null;
        this.loadBorrowers();
      }, error => {
        console.error("Error deleting book:", error);
      })

  }

  updateBorrower() {

    if (this.selectedBorrower.contactNumber && this.selectedBorrower.contactNumber.length !== 10) {
      Swal.fire({
        title: "Invalid Phone Number!",
        html: `please <b>Recheck</b> phone Number!`,
        icon: "error"
      });
      console.log("Contact Number:", this.selectedBorrower.contactNumber);
      this.loadBorrowers();
    } else {

      this.http.put("http://localhost:8081/borrower/update", this.selectedBorrower)
        .subscribe(data => {
          console.log(data);
          Swal.fire({
            title: "Updated!",
            html: `The book <b>${this.selectedBorrower.firstName}</b> is updated`,
            icon: "success"
          });
          this.selectedBorrower = null;
          this.loadBorrowers();
        })
    }
  }



  public searchBorrowers(key: string) {
    console.log(key);
    const results: any[] = [];
    for (const borrower of this.allBorrowersList) {
      if (borrower.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || borrower.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || borrower.contactNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || borrower.address.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(borrower);
      }
    }
    this.allBorrowersList = results;
    if (results.length === 0 || !key) {
      this.loadBorrowers();
    }
  }

}
