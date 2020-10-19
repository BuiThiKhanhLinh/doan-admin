import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../lib/auth.guard';
import { Role } from '../../models/role';
import { SharedModule } from 'src/app/shared/shared.module';
import { TintucComponent } from './tintuc/tintuc.component';
import { DanhmucComponent } from './danhmuc/danhmuc.component';

@NgModule({
  declarations: [TintucComponent,TintucComponent, DanhmucComponent],
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
  ]),  
  ]
})
export class QuanLyModule { }