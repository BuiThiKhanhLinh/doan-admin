import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../lib/auth.guard';
import { Role } from '../../models/role';
import { SharedModule } from 'src/app/shared/shared.module';
import { TintucComponent } from './tintuc/tintuc.component';
import { DanhmucComponent } from './danhmuc/danhmuc.component';
import { BaivietComponent } from './baiviet/baiviet.component';
import { BinhluanComponent } from './binhluan/binhluan.component';
import { HocsinhComponent } from './hocsinh/hocsinh.component';
import { GiaovienComponent } from './giaovien/giaovien.component';
import { TkbComponent } from './tkb/tkb.component';
import { LopComponent } from './lop/lop.component';

@NgModule({
  declarations: [TintucComponent,TintucComponent, DanhmucComponent, BaivietComponent, BinhluanComponent, HocsinhComponent, GiaovienComponent, TkbComponent, LopComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'tintuc',
        component: TintucComponent,
      },
      {
        path: 'danhmuc',
        component: DanhmucComponent,
      },
      {
        path: 'baiviet',
        component: BaivietComponent,
      },
      {
        path: 'binhluan/:id',
        component: BinhluanComponent,
      },
      {
        path: 'giaovien',
        component: GiaovienComponent,
      },
  ]),  
  ]
})
export class QuanLyModule { }