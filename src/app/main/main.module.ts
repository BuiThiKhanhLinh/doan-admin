import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { MenuComponent } from './layout/menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
export const mainRoutes: Routes = [
  {
      path: '', component: MainComponent,
      children: [
        {
            path: '', component: DashboardComponent
        },
       
      ]
  }
];

@NgModule({
  declarations: 
  [
    MainComponent,
    HeaderComponent, 
    MenuComponent, 
    DashboardComponent, 

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoutes)
  ]
})
export class MainModule { }
