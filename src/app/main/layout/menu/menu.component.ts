import { Component, OnInit, Injector } from '@angular/core';
import { AuthenticationService } from 'src/app/lib/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public user : any;
  constructor(private authenticationService: AuthenticationService) { 
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue.phanQuyen.trim();
  }

}
