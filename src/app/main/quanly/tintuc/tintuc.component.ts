import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base.component';
import { Observable} from 'rxjs';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
import { AuthenticationService } from 'src/app/lib/authentication.service';
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
  public loaitin:any;
  public user: any;
  submitted = false;
  constructor(private fb: FormBuilder, injector: Injector, private datePipe: DatePipe,private authenticationService: AuthenticationService,) {
    super(injector);
  }
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tieude': [''] 
    });
    this._api.get('/api/danhmuctin/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.loaitin=res;
      });
    this.user =  this.authenticationService.userValue.phanQuyen.trim();
    console.log(this.user);
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
    this.pageSize = 3;
    this._api.post('/api/tintuc/search',{page: this.page, pageSize: this.pageSize, tieude: this.formsearch.get('tieude').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.tintucs = res.data;
      console.log(this.tintucs);
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
      let anhtmp = value.hinhanh.split('\\');
        let tmp = {
          MaLoai:value.maloai,
          TieuDe:value.tieude,
          HinhAnh:anhtmp[anhtmp.length-1],
          ThoiGian:ngay,
          TrangThai:value.trangthai,
          NoiDung:value.noidung,        
          };
        this._api.post('/api/tintuc/create-tintuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          Swal.fire(
            'Thành công!',
            'Thêm thành công',
            'success'
          );
          this.search();
          this.closeModal();
          });
    } else { 
      let ngay =this.datePipe.transform(this.tintuc.thoiGian,"yyyy-MM-dd");
      let anhtmp = value.hinhanh.split('\\');
        let tmp = {
          maTin:this.tintuc.maTin,
          maLoai:value.maloai,
          tieuDe:value.tieude,
          hinhAnh:anhtmp[anhtmp.length-1],
          thoiGian:ngay,
          trangThai:value.trangthai,
          noiDung:value.noidung,         
          };
          console.log(tmp);
        this._api.post('/api/tintuc/update-tintuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
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

  DuyetTinTuc(item){
    let textConfig = 'Tin tức sẽ được hiển thị';
    if(item.trangThai=="duyệt")
    {
      textConfig = 'Tin tức sẽ được ẩn đi';
    }
   Swal.fire({
    title: 'Bạn muốn thay đổi?',
    text: textConfig,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  }).then((result) => {
    if (result.value) {
      let tmp={
        maTin:item.maTin,
        maLoai:item.maLoai,
        tieuDe:item.tieuDe,
        hinhAnh:item.hinhAnh,
        thoiGian:item.thoiGian,
        trangThai:item.trangThai,
        noiDung:item.noiDung,   
      };
      if(item.trangThai=="duyệt")
        {
          tmp.trangThai = 'chờ';
        }else {
          tmp.trangThai = 'duyệt';
        }
      this._api.post('/api/tintuc/update-tintuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
        Swal.fire(
          'Thành công!',
          'Cập nhật thành công',
          'success'
        );
        this.search();
        });
    }
  })
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
          this._api.post('/api/tintuc/delete-tintuc',{MaTin:row.maTin}).takeUntil(this.unsubscribe).subscribe(res => {
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
    this.tintuc = null;
    this.formdata = this.fb.group({
      'maloai': ['', Validators.required],
        'tieude': ['', Validators.required],
        'hinhanh': ['',Validators.required],
        'trangthai': ['', Validators.required],
        'noidung': ['', Validators.required],
    }); 
    this.formdata.get('trangthai').setValue('duyệt');
    this.formdata.get('maloai').setValue(this.loaitin[0].maLoai);
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
        'trangthai': ['', Validators.required],
        'noidung': ['', Validators.required],
      });
      this.doneSetupForm = true;
      this.formdata.get('trangthai').setValue('duyệt');
      this.formdata.get('maloai').setValue(this.loaitin[0].maLoai);
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
          this.formdata = this.fb.group({
            'maloai': [this.tintuc.maLoai, Validators.required],
            'tieude': [this.tintuc.tieuDe, Validators.required],
            'hinhanh': ['',Validators.required],
            'trangthai': [this.tintuc.trangThai, Validators.required],
            'noidung': [this.tintuc.noiDung, Validators.required],
          }); 
          this.formdata.get('trangthai').setValue(this.tintuc.trangThai);
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
