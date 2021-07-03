import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild, Input  } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import {FormControl, FormGroup} from '@angular/forms'
import { BaseComponent } from '../../../lib/base.component';
import { Observable} from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import { catchError, retry } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/lib/authentication.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent extends BaseComponent implements OnInit {
  public taikhoans: any;
  public taikhoan: any;
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
  datePipe = new DatePipe('en-US');

  constructor(private fb: FormBuilder, injector: Injector, private authenticationService: AuthenticationService) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoten': [''],
      'username': [''],
    });
    this._api.get('/api/taikhoan/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.taikhoan=res;
      });
    this.search();
  }
  loadPage(page) { 
    this._api.post('/api/taikhoan/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.taikhoans = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 6;
    this._api.post('/api/taikhoan/search',{page: this.page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value,username: this.formsearch.get('username').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.taikhoans = res.data;
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
      let ngay = new Date(value.ngaysinh.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
        
        let tmp = {
          Username:value.username,  
          PassWord:value.password,
          HoTen:value.hoten,
          NgaySinh:ngay,
          DiaChi: value.diachi,
          SDT: value.sdt,
          Email: value.email,
          PhanQuyen: value.phanquyen
          };
          
        this._api.post('/api/taikhoan/create-taikhoan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          Swal.fire(
            'Thành công!',
            'Thêm thành công',
            'success'
          );
          this.search();
          this.closeModal();
          });
    } else { 
      let ngay = new Date(value.ngaysinh.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
        let tmp = {
          maTK: this.taikhoan.maTK,
          username: value.username,  
          passWord:value.password,
          hoTen:value.hoten,
          ngaySinh:ngay,
          diaChi: value.diachi,
          sdt: value.sdt,
          email: value.email,
          phanQuyen: value.phanquyen     
          };
          
        this._api.post('/api/taikhoan/update-taikhoan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          Swal.fire(
            'Thành công!',
            'Cập nhật thành công',
            'success'
          );
          this.search();
          this.closeModal();
          });
    }
  } 
  onDelete(row) { 
    Swal.fire({
      title: 'Bạn có chắc muốn xoá?',
      text: 'Bạn sẽ không thể khôi phục bản ghi này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.value) {
        this._api.post('/api/taikhoan/delete-taikhoan',{MaTK:row.maTK}).takeUntil(this.unsubscribe).subscribe(res => {
          this.search(); 
          Swal.fire(
            'Đã xoá!',
            'Bản ghi không thể khôi phục',
            'success'
          );
          });
      }
    })
    
  }

  Reset() {  
    this.taikhoan= null;
    this.formdata = this.fb.group({
        'username': ['', Validators.required],
        'password': ['',Validators.required],
        'nhaplaimatkhau': ['', Validators.required],
        'hoten': ['',Validators.required],
        'ngaysinh': ['',Validators.required],
        'diachi': ['',Validators.required],
        'sdt': ['',Validators.required],
        'email': ['',Validators.required],
        'phanquyen': ['',Validators.required],
      }, {
        validator: MustMatch('password', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.taikhoan = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'username': ['', Validators.required],
        'password': ['',Validators.required],
        'nhaplaimatkhau': ['', Validators.required],
        'hoten': ['',Validators.required],
        'ngaysinh': ['',Validators.required],
        'diachi': ['',Validators.required],
        'sdt': ['',Validators.required],
        'email': ['',Validators.required],
        'phanquyen': ['',Validators.required],
      }, {
        validator: MustMatch('password', 'nhaplaimatkhau')
      });
      this.formdata.get('phanquyen').setValue('Admin');
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
        this.taikhoan = res; 
        let ngay =this.datePipe.transform(this.taikhoan.ngaySinh,"dd-MM-yyyy");
          this.formdata = this.fb.group({
            'username': [this.taikhoan.username, Validators.required],
            'password': [this.taikhoan.password,Validators.required],
            'nhaplaimatkhau': [this.taikhoan.password, Validators.required],
            'hoten': [this.taikhoan.hoTen,Validators.required],
            'ngaysinh': [ngay, Validators.required],
            'diachi': [this.taikhoan.diaChi,Validators.required],
            'sdt': [this.taikhoan.sdt,Validators.required],
            'email': [this.taikhoan.email,Validators.required],
            'phanquyen': [this.taikhoan.phanQuyen,Validators.required],
          }, {
            validator: MustMatch('password', 'nhaplaimatkhau')
          }); 
          this.formdata.get('phanquyen').setValue(this.taikhoan.phanQuyen.trim());
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
   
