import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base.component';
import { Observable} from 'rxjs';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-hocsinh',
  templateUrl: './hocsinh.component.html',
  styleUrls: ['./hocsinh.component.css']
})
export class HocsinhComponent extends BaseComponent implements OnInit {
  public hocsinhs: any;
  public hocsinh: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  public malop:any;
  submitted = false;
  constructor(private fb: FormBuilder, injector: Injector, private datePipe: DatePipe) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoten': [''] 
    });
    this._api.get('/api/hocsinh/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.malop=res;
      });
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/hocsinh/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.hocsinhs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 10;
    this._api.post('/api/hocsinh/search',{page: this.page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.hocsinhs = res.data;
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
      let ngay =this.datePipe.transform(value.ngaysinh,"yyyy-MM-dd");
        let tmp = {
          MaLop:value.malop,  
          HoTen:value.hoten,
          GioiTinh:value.gioitinh,
          NgaySinh:ngay,
          DiaChi:value.diachi,
          SDT:value.sdt,
          KhoaHoc:value.khoahoc,
      
          };
        this._api.post('/api/hocsinh/create-hocsinh',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
      let ngay =this.datePipe.transform(value.ngaysinh,"yyyy-MM-dd");
        let tmp = {
          maHS:this.hocsinh.maHS,
          maLop:value.malop,
          hoTen:value.hoten,
          gioiTinh:value.gioitinh,
          ngaySinh:ngay,
          diaChi:value.diachi,
          sdt:value.sdt,
          khoaHoc:value.khoahoc,         
          };
          console.log(tmp);
        this._api.post('/api/hocsinh/update-hocsinh',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/hocsinh/delete-hocsinh',{MaHS:row.maHS}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.hocsinh = null;
    this.formdata = this.fb.group({
        'malop': ['', Validators.required],
        'hoten': ['',Validators.required],
        'gioitinh': ['',Validators.required],
        'ngaysinh': ['', Validators.required],
        'diachi': ['', Validators.required],
        'sdt': ['', Validators.required],
        'khoahoc': ['', Validators.required],

    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.hocsinh = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'malop': [''],
        'hoten': ['',Validators.required],
        'gioitinh': ['',Validators.required],
        'ngaysinh': ['', Validators.required],
        'diachi': ['', Validators.required],
        'sdt': ['', Validators.required],
        'khoahoc': ['', Validators.required],

      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/hocsinh/get-by-id/'+ row.maHS).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.hocsinh = res; 
        let ngay =this.datePipe.transform(this.hocsinh.ngaySinh,"dd-MM-yyyy");
          this.formdata = this.fb.group({
            'maLop': [this.hocsinh.maLop],
            'hoten': [this.hocsinh.hoTen,Validators.required],
            'gioitinh': [this.hocsinh.gioitinh,Validators.required],
            'ngaysinh': [ngay, Validators.required],
            'diachi': [this.hocsinh.diaChi, Validators.required],
            'sdt': [this.hocsinh.sdt, Validators.required],
            'khoahoc': [this.hocsinh.khoahoc, Validators.required],
            
          }); 
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
