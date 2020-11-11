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
  public loaitin:any;
  submitted = false;
  public mabv:any;
  constructor(private fb: FormBuilder, injector: Injector, private datePipe: DatePipe) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tieude': [''] 
    });
    this._route.params.subscribe(params => {
      this.mabv = params['id'];
    });
   this.search();
   
  }

  loadPage(page) { 
    this._api.post('/api/binhluan/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
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
          MaLoai:value.maloai,
          TieuDe:value.tieude,
          HinhAnh:value.hinhanh,
          ThoiGian:ngay,
          TrangThai:value.trangthai,
          NoiDung:value.noidung,        
          };
        this._api.post('/api/tintuc/create-tintuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
      var date = new Date();
      let ngay =this.datePipe.transform(date,"yyyy-MM-dd");
        let tmp = {
          maTin:this.binhluan.maTin,
          maLoai:value.maloai,
          tieuDe:value.tieude,
          hinhAnh:value.hinhanh,
          thoiGian:ngay,
          trangThai:value.trangthai,
          noiDung:value.noidung,         
          };
        this._api.post('/api/tintuc/update-tintuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
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
      'maloai': ['', Validators.required],
        'tieude': ['', Validators.required],
        'hinhanh': ['',Validators.required],
        'trangthai': ['', Validators.required],
        'noidung': ['', Validators.required],
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
        'maloai': ['', Validators.required],
        'tieude': ['', Validators.required],
        'hinhanh': ['',Validators.required],
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
      this._api.get('/api/tintuc/get-by-id/'+ row.maTin).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.binhluan = res; 
          this.formdata = this.fb.group({
            'maloai': [this.binhluan.maLoai, Validators.required],
            'tieude': [this.binhluan.tieuDe, Validators.required],
            'hinhanh': [this.binhluan.hinhAnh,Validators.required],
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

