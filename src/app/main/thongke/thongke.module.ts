import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../lib/auth.guard';
import { Role } from '../../models/role';
import { SharedModule } from 'src/app/shared/shared.module';
import { TopbaivietComponent } from './topbaiviet/topbaiviet.component';

@NgModule({
  declarations: [TopbaivietComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'topbaiviet',
        component: TopbaivietComponent,
      },
  ]),  
  ]
})
export class ThongkeModule { }