import { DataAccessService } from './../data-access.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Employee {
  id: number;
  name: string;
  department: string;
  joining_date: string;
  experience?: number;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  avatar: File;
  candidate_data;
  filterValue: Array<any> = [];
  orderName: boolean = false;
  reactiveForm: FormGroup;
  newVariable;
  constructor(private service: DataAccessService, private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      name: ['', [ Validators.required ]],
      email: ['', [ Validators.required ]],
      phone: ['', [ Validators.required ]],
      department: ['', [ Validators.required ]]
    });
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.service.get('employee').subscribe(response => {
      this.candidate_data = JSON.parse(JSON.stringify(response));
      this.filterValue = this.candidate_data;
    });
  }

  getPDF() {
    this.service.get('employee/pdf').subscribe(response => {
      console.log(response);
    });
  }

  onFileChanged(event): void {
    if (event.target.files.length > 0) {
      this.avatar = event.target.files[0];
    }
  }

  saveEmployee() {
    const formData = new FormData();
    formData.append('name', this.reactiveForm.value.name);
    formData.append('email', this.reactiveForm.value.email);
    formData.append('phone', this.reactiveForm.value.phone);
    formData.append('department', this.reactiveForm.value.department);

    this.service.post('employee', formData).subscribe(response => {
      const result = JSON.parse(JSON.stringify(response));
      if (result.status == 'success') {
        this.getEmployees();
        this.reactiveForm.reset();
      } else {
        alert('something went wrong');
      }
    });
  }

  deleteEmployee(id) {
    this.service.delete('employee/' + id).subscribe(response => {
      const result = JSON.parse(JSON.stringify(response));
      if (result.status === 'success') {
        this.getEmployees();
      } else {
        alert('something went wrong');
      }
    });
  }

  filterByText(initial: string) {
    this.candidate_data = this.filterValue;
    this.candidate_data = this.candidate_data.filter(i => i.name.toLowerCase().indexOf(initial.toLocaleLowerCase()) !== -1);
  }

  sortByName() {
    if (this.orderName) {
      this.candidate_data = this.candidate_data.sort((i, j) => (j.name > i.name ? -1 : 1));
    }
    else {
      this.candidate_data = this.candidate_data.sort((i, j) => (j.name > i.name ? 1 : -1));
    }
    this.orderName = !this.orderName;
  }

}
