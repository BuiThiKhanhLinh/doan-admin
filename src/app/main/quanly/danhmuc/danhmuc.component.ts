import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base.component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-danhmuc',
  templateUrl: './danhmuc.component.html',
  styleUrls: ['./danhmuc.component.css']
})
export class DanhmucComponent extends BaseComponent implements OnInit {
  public danhmucs: any;
  public danhmuc: any;
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
      'loaitin': [''] 
    });
   this.search();
   console.log("ok");
  }

  loadPage(page) { 
    this._api.post('/api/danhmuc/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.danhmucs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
      console.log(this.danhmucs);
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/danhmuc/search',{page: this.page, pageSize: this.pageSize, loaitin: this.formsearch.get('loaitin').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.danhmucs = res.data;
      console.log(this.danhmucs);
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
          loaiTin:value.loaitin,     
          };
        this._api.post('/api/danhmuc/create-danhmuctin',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = {
          maLoai:value.maloai,
          loaiTin:value.loaitin,      
          };
        this._api.post('/api/danhmuc/update-danhmuctin',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/danhmuc/delete-danhmuctin',{user_id:row.user_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.danhmuc = null;
    this.formdata = this.fb.group({
      'maloai': ['', Validators.required],
      'loaitin': ['', Validators.required],

    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.danhmuc = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'maloai': ['', Validators.required],
        'loaitin': ['', Validators.required],
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
      this._api.get('/api/danhmuc/get-by-id/'+ row.maTin).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.danhmuc = res; 
        console.log(this.danhmuc);
          this.formdata = this.fb.group({
            'maloai': [this.danhmuc.maLoai, Validators.required],
            'loaitin': [this.danhmuc.loaiTin, Validators.required],

          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}

