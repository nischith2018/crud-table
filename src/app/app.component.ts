import { Component, VERSION, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { AppService } from "./app.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  columns = [
    { title: "ID", data: "userid" },
    { title: "Name", data: "name" },
    { title: "Technology", data: "technology" },
    { title: "Company", data: "company" },
    { title: "Actions", data: "Actions" }
  ];

  inputData = [];
  createForm: any;
  showInput = false;
  crud = {
    isCreate: false,
    isEdit: false,
    isUpdate: false,
    createData: null,
    updateData: null
  };
  searchData = "";
  filteredArray = [];
  oldArray = [];
  lastIdValue = 0;
  enableSearch = true;

  /** Injecting formbuilder and service */
  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService
  ) {}

  /** oninit lifecycle hook */
  ngOnInit() {
    this.createForm = this.formBuilder.group({
      userid: "",
      name: "",
      technology: "",
      company: ""
    });
  }

  /** return function for trackBy */
  titles(item) {
    return item;
  }
  inputs(item) {
    return item;
  }

  /**Add function creates new empty row */
  add() {
    this.crud.isCreate = true;
    this.createForm.reset({
      userid: "",
      name: "",
      technology: "",
      company: ""
    });
  }

  /**Edit function resets the form values and hiding other buttons */

  edit(data) {
    this.crud.isUpdate = true;
    this.crud.isEdit = true;
    this.crud.updateData = data;
    this.createForm.reset({
      userid: this.crud.updateData.userid,
      name: this.crud.updateData.name,
      technology: this.crud.updateData.technology,
      company: this.crud.updateData.company
    });
  }

  /**Update function  */
  update() {
    this.crud.isUpdate = false;
    let editRow = this.createForm.getRawValue();
    this.appService.editEmployee(editRow).subscribe((data: any) => {
      let updatedData = data;
      const editedEmployee = this.inputData.find(
        employee => updatedData["userid"] === employee.userid
      ); //finding edited userid
      const index = this.inputData
        .map(x => {
          return x.userid;
        })
        .indexOf(editedEmployee["userid"]); // finding index of edited userid
      this.inputData.splice(index, 1); // removing old user by using index
      this.inputData.splice(index, 0, updatedData); // replacing edited user
    });
    this.crud.updateData = null;
  }
  /**generate table data */
  getData(data, title) {
    return data[title];
  }

  /**create a new record */
  create() {
    this.crud.isCreate = false;
    let addRow = this.createForm.getRawValue(); //fetching values from form
    addRow.userid = this.lastIdValue + 1;
    this.lastIdValue = addRow.userid;
    this.appService.createEmployee(addRow).subscribe((data: []) => {
      // interacting with API to create a new record
      this.inputData.push(data); // pushing new record to the existing input
    });
  }
  /**Deleting the record */
  delete(userid) {
    const option = confirm("Are u sure you want to delete the record?"); //asking confirmation to delete the user
    if (option) {
      const b = this.appService.deleteEmployee(userid);
      this.inputData = this.inputData.filter(obj => obj.userid !== userid); // removing the user based on userid
    }
  }

  /**Cancel the edit operation */

  cancel() {
    this.crud.isUpdate = false;
    this.crud.updateData = null;
  }

  /**Search functionality */
  search() {
    this.enableSearch = false;
    this.inputData.forEach(data => {
      let temp = false;
      Object.keys(data).forEach(key => {
        //iterating the object to
        if (
          this.searchData !== "" &&
          key !== "id" &&
          String(data[key]).includes(this.searchData) //checking whether the array includes the search string
        ) {
          temp = true;
        }
      });
      if (temp) {
        this.filteredArray.push(data); // pushing unique values
      }
    });

    this.oldArray = this.inputData;
    this.inputData = this.filteredArray.length > 0 ? this.filteredArray : [];
  }

  /**clearing the search functionality and resets the value*/

  clearsearch() {
    if (this.inputData.length > 0) {
      let editedEmployee = this.oldArray.find(
        employee => this.inputData[0].userid === employee.userid
      );

      const index = this.oldArray.findIndex(
        item => item.userid === editedEmployee["userid"]
      );
      this.oldArray.splice(index, 1); // removing old user by using index
      this.oldArray.splice(index, 0, this.inputData[0]); // replacing edited user
    }

    this.inputData = this.oldArray;
    this.filteredArray = [];
    this.searchData = ""; //
    this.enableSearch = true;
  }
}
