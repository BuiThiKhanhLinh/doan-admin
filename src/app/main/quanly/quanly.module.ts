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
        canActivate: [RoleGuard],
        data: { roles : [Role.Admin, Role.Censor, Role.Writer]},
      },
      {
        path: 'danhmuc',
        component: DanhmucComponent,
        canActivate: [RoleGuard],
        data: { roles : [Role.Admin]},
      },
      {
        path: 'baiviet',
        component: BaivietComponent,
        canActivate: [RoleGuard],
        data: { roles : [Role.Admin, Role.Censor]},
      },
      {
        path: 'binhluan/:id',
        component: BinhluanComponent,
        canActivate: [RoleGuard],
        data: { roles : [Role.Admin, Role.Censor]},
      },
      {
        path: 'giaovien',
        component: GiaovienComponent,
        canActivate: [RoleGuard],
        data: { roles : [Role.Admin]},
      },
      {
        path: 'hocsinh',
        component: HocsinhComponent,
        canActivate: [RoleGuard],
        data: { roles : [Role.Admin]},
      },
      {
        path: 'lop',
        component: LopComponent,
        canActivate: [RoleGuard],
        data: { roles : [Role.Admin]},
      },
      {
        path: 'tkb',
        component: TkbComponent,
        canActivate: [RoleGuard],
        data: { roles : [Role.Admin]},
      },
  ]),  
  ]
})
export class QuanLyModule { }