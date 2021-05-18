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
  selector: 'app-binhluan',
  templateUrl: './binhluan.component.html',
  styleUrls: ['./binhluan.component.css']
})
export class BinhluanComponent extends BaseComponent implements OnInit {
  public binhluans: any;
  public binhluan: any;
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
  public mabv:any;
  constructor(private fb: FormBuilder, injector: Injector, private datePipe: DatePipe) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'mabv': [''] 
    });
    this._route.params.subscribe(params => {
      this.mabv = params['id'];
    });
   this.search();
   
  }

  loadPage(page) { 
    this._api.post('/api/binhluan/search',{page: page, pageSize: this.pageSize, mabv: this.mabv}).takeUntil(this.unsubscribe).subscribe(res => {
      this.binhluans = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/binhluan/search',{page: this.page, pageSize: this.pageSize, mabv: this.mabv}).takeUntil(this.unsubscribe).subscribe(res => {
      this.binhluans = res.data;
      console.log(this.binhluans);
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
      var date = new Date();
      let ngay =this.datePipe.transform(date,"yyyy-MM-dd");
        let tmp = {
          MaTK:value.matk,
          Username:value.username,
          ThoiGian:ngay,
          NoiDung:value.noidung, 
          TrangThai:value.trangthai,
          MaBaiViet:value.mabv,       
          };
        this._api.post('/api/binhluan/create-binhluan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
      var date = new Date();
      let ngay =this.datePipe.transform(date,"yyyy-MM-dd");
        let tmp = {
          maBL:this.binhluan.mabl,
          maTK:value.matk,
          username:value.username,
          thoiGian:ngay,
          noiDung:value.noidung,   
          trangThai:value.trangthai,
          maBaiViet:value.mabv,   
          };
        this._api.post('/api/binhluan/update-binhluan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/binhluan/delete-binhluan',{MaBL:row.maBL}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.binhluan = null;
    this.formdata = this.fb.group({
      'mabl': ['', Validators.required],
        'matk': ['', Validators.required],
        'username': ['',Validators.required],
        'trangthai': ['', Validators.required],
        'noidung': ['', Validators.required],
    }); 
  }
 DuyetBinhLuan(item){
   if(item.trangThai=="duyệt")
   {
     item.trangThai="chờ"
   }else{
    item.trangThai="duyệt"
  }
  console.log(item);
   let tmp={
     MaBL: item.maBL,
     MaTK: item.maTK,
     Username: item.username,
     HoTen: item.hoTen,
     ThoiGian: item.thoiGian,
     NoiDung: item.noiDung,
     TrangThai:item.trangThai,
     MaBaiViet: item.maBaiViet
   }
  this._api.post('/api/binhluan/update-binhluan',tmp).takeUntil(this.unsubscribe).subscribe(res => {
    alert('Duyệt thành công bình luận');
    this.search();
    });
 }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.binhluan = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'mabl': ['', Validators.required],
        'matk': ['', Validators.required],
        'username': ['',Validators.required],
        'trangthai': ['', Validators.required],
        'noidung': ['', Validators.required],
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
      this._api.get('/api/binhluan/get-by-id/'+ row.MaBL).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.binhluan = res; 
          this.formdata = this.fb.group({
            'mabl': [this.binhluan.maBL, Validators.required],
            'matk': [this.binhluan.maTK, Validators.required],
            'username': [this.binhluan.Username,Validators.required],
            'trangthai': [this.binhluan.trangThai, Validators.required],
            'noidung': [this.binhluan.noiDung, Validators.required],
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

