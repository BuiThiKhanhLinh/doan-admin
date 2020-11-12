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
  selector: 'app-giaovien',
  templateUrl: './giaovien.component.html',
  styleUrls: ['./giaovien.component.css']
})
export class GiaovienComponent extends BaseComponent implements OnInit {
  public giaoviens: any;
  public giaovien: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  public monday:any;
  submitted = false;
  constructor(private fb: FormBuilder, injector: Injector, private datePipe: DatePipe) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoten': [''] 
    });
    this._api.get('/api/giaovien/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.monday=res;
      });
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/giaovien/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.giaoviens = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 8;
    this._api.post('/api/giaovien/search',{page: this.page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.giaoviens = res.data;
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
          MonDay:value.monday,
          ToDay:value.today,  
          HoTen:value.hoten,
          NgaySinh:ngay,
          DiaChi:value.diachi,
          SDT:value.sdt,
          ChucVu:value.chucvu,
          MaLop:value.malop,        
          };
        this._api.post('/api/giaovien/create-giaovien',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
      let ngay =this.datePipe.transform(value.ngaysinh,"yyyy-MM-dd");
        let tmp = {
          maGV:this.giaovien.maGV,
          monDay:value.monday,
          toDay:value.today,
          hoTen:value.hoten,
          ngaySinh:ngay,
          diaChi:value.diachi,
          sdt:value.sdt,
          chucVu:value.chucvu, 
          maLop:value.malop        
          };
          console.log(tmp);
        this._api.post('/api/giaovien/update-giaovien',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/giaovien/delete-giaovien',{MaGV:row.maGV}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.giaovien = null;
    this.formdata = this.fb.group({
      'monday': ['', Validators.required],
        'today': ['', Validators.required],
        'hoten': ['',Validators.required],
        'ngaysinh': ['', Validators.required],
        'diachi': ['', Validators.required],
        'sdt': ['', Validators.required],
        'chucvu': ['', Validators.required],
        'malop': ['', Validators.required],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.giaovien = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'monday': ['', Validators.required],
        'today': ['', Validators.required],
        'hoten': ['',Validators.required],
        'ngaysinh': ['', Validators.required],
        'diachi': ['', Validators.required],
        'sdt': ['', Validators.required],
        'chucvu': ['', Validators.required],
        'malop': [''],
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
      this._api.get('/api/giaovien/get-by-id/'+ row.maGV).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.giaovien = res; 
        let ngay =this.datePipe.transform(this.giaovien.ngaySinh,"dd-MM-yyyy");
          this.formdata = this.fb.group({
            'monday': [this.giaovien.monDay, Validators.required],
            'today': [this.giaovien.toDay, Validators.required],
            'hoten': [this.giaovien.hoTen,Validators.required],
            'ngaysinh': [ngay, Validators.required],
            'diachi': [this.giaovien.diaChi, Validators.required],
            'sdt': [this.giaovien.sdt, Validators.required],
            'chucvu': [this.giaovien.chucVu, Validators.required],
            'maLop': [this.giaovien.maLop],
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
