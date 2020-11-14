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
  selector: 'app-tkb',
  templateUrl: './tkb.component.html',
  styleUrls: ['./tkb.component.css']
})
export class TkbComponent extends BaseComponent implements OnInit {
  public tkbs: any;
  public tkb: any;
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
      'malop': [''] 
    });
    this._api.get('/api/tkb/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.malop=res;
      });
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/tkb/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.tkbs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 10;
    this._api.post('/api/tkb/search',{page: this.page, pageSize: this.pageSize, malop: this.formsearch.get('malop').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.tkbs = res.data;
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
          MaGV:value.magv,  
          MaLop:value.malop,
          TenMon:value.tenmon,
          TietDay:value.tietday,
          Thu:value.thu,
          GVCN:value.gvcn,   
          };
        this._api.post('/api/tkb/create-tkb',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = {
          maTKB:this.tkb.maTKB,
          maGV:value.magv,
          maLop:value.malop,
          tenMon:value.tenmon,
          tietDay:value.tietday,
          thu:value.thu,
          gvcn:value.gvcn,     
          };
          console.log(tmp);
        this._api.post('/api/tkb/update-tkb',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/tkb/delete-tkb',{MaTKB:row.maTKB}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.tkb = null;
    this.formdata = this.fb.group({
        'magv': ['', Validators.required],
        'malop': ['',Validators.required],
        'tenmon': ['',Validators.required],
        'tietday': ['', Validators.required],
        'thu': ['', Validators.required],
        'gvcn': ['', Validators.required],

    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.tkb = null;
    setTimeout(() => {
      $("#createUserModal").modal("show");
      this.formdata = this.fb.group({
        'magv': ['', Validators.required],
        'malop': ['',Validators.required],
        'tenmon': ['',Validators.required],
        'tietday': ['', Validators.required],
        'thu': ['', Validators.required],
        'gvcn': ['', Validators.required],
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
      this._api.get('/api/tkb/get-by-id/'+ row.maHS).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.tkb = res; 
          this.formdata = this.fb.group({
            'magv': [this.tkb.maGV],
            'malop': [this.tkb.maLop],
            'tenmon': [this.tkb.tenMon,Validators.required],
            'tietday': [this.tkb.tietDay,Validators.required],
            'thu': [this.tkb.thu, Validators.required],
            'gvcn': [this.tkb.gvcn, Validators.required],       
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
