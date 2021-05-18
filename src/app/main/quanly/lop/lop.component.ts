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
  selector: 'app-lop',
  templateUrl: './lop.component.html',
  styleUrls: ['./lop.component.css']
})
export class LopComponent extends BaseComponent implements OnInit {
  public lops: any;
  public lop: any;
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
      'tenlop': [''] 
    });
    this._api.get('/api/lop/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.malop=res;
      });
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/lop/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.lops = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 10;
    this._api.post('/api/lop/search',{page: this.page, pageSize: this.pageSize, tenlop: this.formsearch.get('tenlop').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.lops = res.data;
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
          MaLop:value.malop,  
          TenLop:value.tenlop,
          SiSo:value.siso,
      
          };
        this._api.post('/api/lop/create-lop',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = {
          maLop:value.malop,
          tenLop:value.tenlop,
          siSo:value.siso,       
          };
          console.log(tmp);
        this._api.post('/api/lop/update-lop',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/lop/delete-lop',{MaLop:row.maLop}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.lop = null;
    this.formdata = this.fb.group({
        'malop': ['', Validators.required],
        'tenlop': ['',Validators.required],
        'siso': ['',Validators.required],

    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.lop = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'malop': ['',Validators.required],
        'tenlop': ['',Validators.required],
        'siso': ['',Validators.required],

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
      this._api.get('/api/lop/get-by-id/'+ row.maLop).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.lop = res; 
          this.formdata = this.fb.group({
            'maLop': [this.lop.maLop,Validators.required],
            'tenlop': [this.lop.tenLop,Validators.required],
            'siso': [this.lop.siSo,Validators.required],
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
