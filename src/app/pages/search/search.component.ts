import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_BASE } from 'src/config/config';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  public elements:Observable<Object>;
  private hint:string;

  constructor(private ar:ActivatedRoute,
              private http:HttpClient) { 
    this.ar.params.subscribe(params => {
      this.hint = params['hint'];
      this.search();
    })
  }

  ngOnInit() {
  }

  public search():void {
    this.elements = this.http.get(`${URL_BASE}/search/all/${this.hint}`);
  }

}
