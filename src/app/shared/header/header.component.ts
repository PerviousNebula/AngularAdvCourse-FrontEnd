import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/service.index';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  public user:User;

  constructor(public _user:UserService) { 
    this.user = this._user.user;
  }

  ngOnInit() { }

}
