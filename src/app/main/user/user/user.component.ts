import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild, Input  } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import {FormControl, FormGroup} from '@angular/forms'
import { BaseComponent } from '../../../lib/base.component';
import { Observable} from 'rxjs';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/lib/authentication.service';
declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent extends BaseComponent implements OnInit {
  public users: any;
  public user: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  constructor(private fb: FormBuilder, injector: Injector, private authenticationService: AuthenticationService,private datePipe: DatePipe) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoten': [''],
      'username': [''],     
    });
    this.search();
  }
  loadPage(page) { 
    this._api.post('/api/taikhoan/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.users = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 10;
    this._api.post('/api/taikhoan/search',{page: this.page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value,username: this.formsearch.get('username').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.users = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
        let tmp = {
          UserName:value.UserName,  
          PassWord:value.Password,
          HoTen:value.HoTen,
          NgaySinh:value.NgaySinh,
          DiaChi: value.DiaChi,
          SDT: value.SDT,
          Email: value.Email,
          PhanQuyen: value.PhanQuyen
          };
        this._api.post('/api/taikhoan/create-taikhoan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = {
          MaTK: this.user.maTK,
          UserName: value.UserName,  
          PassWord:value.Password,
          HoTen:value.HoTen,
          NgaySinh:value.NgaySinh,
          DiaChi: value.DiaChi,
          SDT: value.SDT,
          Email: value.Email,
          PhanQuyen: value.PhanQuyen     
          };
          console.log(tmp);
        this._api.post('/api/taikhoan/update-taikhoan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/taikhoan/delete-taikhoan',{MaTK:row.maTK}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.user = null;
    this.formdata = this.fb.group({
        'UserName': ['', Validators.required],
        'Password': ['',Validators.required],
        'HoTen': ['',Validators.required],
        'NgaySinh': ['',Validators.required],
        'DiaChi': ['',Validators.required],
        'SDT': ['',Validators.required],
        'Email': ['',Validators.required],
        'PhanQuyen': ['',Validators.required],

    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.user = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'UserName': ['', Validators.required],
        'Password': ['',Validators.required],
        'HoTen': ['',Validators.required],
        'NgaySinh': ['',Validators.required],
        'DiaChi': ['',Validators.required],
        'SDT': ['',Validators.required],
        'Email': ['',Validators.required],
        'PhanQuyen': ['',Validators.required],

      });
      this.formdata.get('PhanQuyen').setValue('Admin');
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/taikhoan/get-by-id/'+ row.maTK).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.user = res; 
          this.formdata = this.fb.group({
            'UserName': [this.user.username, Validators.required],
            'Password': [this.user.password,Validators.required],
            'HoTen': [this.user.hoTen,Validators.required],
            'NgaySinh': [this.user.ngaySinh,Validators.required],
            'DiaChi': [this.user.diaChi,Validators.required],
            'SDT': [this.user.sdt,Validators.required],
            'Email': [this.user.email,Validators.required],
            'PhanQuyen': [this.user.phanQuyen,Validators.required],
          }); 
          this.formdata.get('PhanQuyen').setValue(this.user.phanQuyen.trim());
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
  catText(text: string, limit: number): string {
    if(text.length > limit) {
      return text.substr(0, limit) + "...";
    }
    return text;
  }
}
   
