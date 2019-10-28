import { Component, OnInit } from '@angular/core';
import { SidebarService, UserService } from 'src/app/services/service.index';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  public user:User;

  constructor(public _sidebar:SidebarService, public _user:UserService) { }

  ngOnInit() {
    this.user = this._user.user;
  }

}
