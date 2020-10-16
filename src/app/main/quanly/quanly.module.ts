import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TintucComponent } from './tintuc/tintuc.component';

@NgModule({
  declarations: [TintucComponent, TintucComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'tintuc',
        component: TintucComponent,
      },
  ]),  
  ]
})
export class QuanLyModule { }