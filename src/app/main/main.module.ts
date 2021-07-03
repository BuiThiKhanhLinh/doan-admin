import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { MenuComponent } from './layout/menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleGuard } from '../lib/auth.guard';
import { Role } from '../models/role';
import { SharedModule } from 'src/app/shared/shared.module';
import { UnauthorizedComponent } from '../shared/unauthorized/unauthorized.component';
export const mainRoutes: Routes = [
  {
      path: '', component: MainComponent,
      children: [
        {
            path: '', component: DashboardComponent,
            canActivate: [RoleGuard],
            data: { roles : [Role.Admin, Role.Censor, Role.Writer]},
        },
        {
          path: 'unauthorized',
          component: UnauthorizedComponent,
        },
        {
          path: 'user',
          loadChildren: () =>
            import('../main/user/user.module').then((m) => m.UserModule),
          canActivate: [RoleGuard],
          data: { roles : [Role.Admin]}
        },
        {
          path: 'quanly',
          loadChildren: () =>
            import('../main/quanly/quanly.module').then((m) => m.QuanLyModule),
          canActivate: [RoleGuard],
          data: { roles : [Role.Admin, Role.Censor, Role.Writer]},
        },
        {
          path: 'thongke',
          loadChildren: () =>
            import('../main/thongke/thongke.module').then((m) => m.ThongkeModule),
          canActivate: [RoleGuard],
          data: { roles : [Role.Admin, Role.Censor, Role.Writer]},
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
    DashboardComponent 

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(mainRoutes)
  ]
})
export class MainModule { }
