import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base.component';
import { Observable} from 'rxjs';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { cpuUsage } from 'process';
declare var $: any;

@Component({
  selector: 'app-topbaiviet',
  templateUrl: './topbaiviet.component.html',
  styleUrls: ['./topbaiviet.component.css']
})
export class TopbaivietComponent extends BaseComponent implements OnInit {
  public baiviets: any;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this._api.get('/api/baiviet/get-top5-bai-viet').takeUntil(this.unsubscribe).subscribe(res => {
      this.baiviets=res;
      console.log(this.baiviets);
      });
  }
  catText(text: string, limit: number): string {
    if(text.length > limit) {
      return text.substr(0, limit) + "...";
    }
    return text;
  }

}
