import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base.component';
import { Observable} from 'rxjs';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-topbaiviet',
  templateUrl: './topbaiviet.component.html',
  styleUrls: ['./topbaiviet.component.css']
})
export class TopbaivietComponent extends BaseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
