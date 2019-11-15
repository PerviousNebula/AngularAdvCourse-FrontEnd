import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/service.index';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  public user:User;

  constructor(public _user:UserService,
              private router:Router) { 
    this.user = this._user.user;
  }

  ngOnInit() { }

  public search(hint:string):void {
    if(hint.length)
      this.router.navigate(['search',hint]);
  }

}
