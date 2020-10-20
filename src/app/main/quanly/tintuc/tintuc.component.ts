import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base.component';
import { Observable} from 'rxjs';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-tintuc',
  templateUrl: './tintuc.component.html',
  styleUrls: ['./tintuc.component.css']
})
export class TintucComponent extends BaseComponent implements OnInit {
  public tintucs: any;
  public tintuc: any;
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
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tieude': [''] 
    });
   this.search();
 
  }

  loadPage(page) { 
    this._api.post('/api/tintuc/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.tintucs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/tintuc/search',{page: this.page, pageSize: this.pageSize, tieude: this.formsearch.get('tieude').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.tintucs = res.data;
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
          maLoai:value.maloai,
          tieuDe:value.tieude,
          hinhAnh:value.hinhanh,
          thoiGian:value.thoigian,
          trangThai:value.trangthai,
          noiDung:value.noidung,        
          };
        this._api.post('/api/tintuc/create-tintuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = {
          maLoai:value.maloai,
          tieuDe:value.tieude,
          hinhAnh:value.hinhanh,
          thoiGian:value.thoigian,
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
    this._api.post('/api/tintuc/delete-tintuc',{user_id:row.user_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.tintuc = null;
    this.formdata = this.fb.group({
      'maloai': ['', Validators.required],
        'tieude': ['', Validators.required],
        'hinhanh': ['',Validators.required],
        'ngay': ['', Validators.required],
        'trangthai': ['', Validators.required],
        'noidung': ['', Validators.required],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.tintuc = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'maloai': ['', Validators.required],
        'tieude': ['', Validators.required],
        'hinhanh': ['',Validators.required],
        'ngay': ['', Validators.required],
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
        this.tintuc = res; 
        console.log(this.tintuc);
          this.formdata = this.fb.group({
            'maloai': [this.tintuc.maLoai, Validators.required],
            'tieude': [this.tintuc.tieuDe, Validators.required],
            'hinhanh': [this.tintuc.hinhAnh,Validators.required],
            'ngay': [this.tintuc.thoiGian, Validators.required],
            'trangthai': [this.tintuc.trangThai, Validators.required],
            'noidung': [this.tintuc.noiDung, Validators.required],
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
