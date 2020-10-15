import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainModule } from 'src/app/main/main.module';
import { TintucComponent } from './tintuc/tintuc.component';

export const mainRoutes: Routes = [
    {
        children: [
          {
              path: 'tintuc', component: TintucComponent
          },
    ]
}
];

@NgModule({
declarations: [],
imports: [
  CommonModule,
  MainModule,
  RouterModule.forChild(mainRoutes)
]
})
export class QuanLyModule { }