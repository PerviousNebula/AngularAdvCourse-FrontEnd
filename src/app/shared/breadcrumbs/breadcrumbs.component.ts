import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent implements OnInit {
  public pageTitle:string;

  constructor(private router:Router,
              private title:Title,
              private meta:Meta) {     
    this.getDataRoute().subscribe((resp) => {
      this.pageTitle = resp.title;
      this.title.setTitle(resp.title);
      const METATAG: MetaDefinition = {
        name: "description",
        content: resp.desc
      };
      this.meta.updateTag(METATAG);
    });
  }

  ngOnInit() {
  }

  public getDataRoute():Observable<any> {
    return this.router.events.pipe(filter(routerEvent => routerEvent instanceof ActivationEnd),
                                   filter((routerEvent:any) => !routerEvent.snapshot.firstChild),
                                   map((routerEvent:any) => routerEvent.snapshot.data));
  }

}
