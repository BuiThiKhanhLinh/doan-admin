import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { MenuComponent } from './layout/menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleGuard } from '../lib/auth.guard';
import { Role } from '../models/role';
export const mainRoutes: Routes = [
  {
      path: '', component: MainComponent,
      children: [
        {
            path: '', component: DashboardComponent
        },
        {
          path: 'user',
          loadChildren: () =>
            import('../main/user/user.module').then((m) => m.UserModule),
          canActivate: [RoleGuard],
        },
        {
          path: 'quanly',
          loadChildren: () =>
            import('../main/quanly/quanly.module').then((m) => m.QuanLyModule),
          canActivate: [RoleGuard],
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
