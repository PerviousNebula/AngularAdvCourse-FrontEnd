import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import Swal from 'sweetalert2';

// Models
import { User } from 'src/app/models/user.model';

// Services
import { UserService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  public formFilter:FormGroup;
  public usersObs:Observable<Object>;
  private updateSubs:Subscription;
  private deleteSubs:Subscription;
  private modalSubs:Subscription;
  public filtering:boolean;

  constructor(public _user:UserService, 
              public _modal:ModalUploadService) { 
    this.formFilter = new FormGroup({
      name: new FormControl("",[Validators.required]),
      email: new FormControl("", [Validators.email])
    });
    this.filtering = false;
  }

  ngOnInit() {
    this.usersObs = this._user.getAllUsers();
    this.modalSubs = this._modal.notification.subscribe(() => this.usersObs = this._user.getAllUsers());
  }
  
  ngOnDestroy() {}

  public resetAll():void {
    this._user.fromPagination = 0;
    this._user.fromPaginationFilter = 0;
    this.filtering = false;
    this.formFilter.reset();
    this.usersObs = this._user.getAllUsers();
  }

  public loadPage(value:number):void {
    let fromIndex = this._user.fromPagination + value;
    if(fromIndex > this._user.totalUsers || fromIndex < 0)
      return;
    this._user.fromPagination += value;
    this.usersObs = this._user.getAllUsers();
  }

  public goToLimit(value:number):void {
    if(value) {
      let pages = Math.floor(this._user.totalUsers / 5);
      this._user.fromPagination = pages * 5;
      this.usersObs = this._user.getAllUsers();
    } else {
      this._user.fromPagination = 0;
      this.usersObs = this._user.getAllUsers();
    }
  }
  
  public goToLimitFilter(value:number):void {
    if(value) {
      const NOT_PAGES_REMAINDER = !(this._user.totalUsersFilter % 5);
      if(NOT_PAGES_REMAINDER)
        this._user.fromPaginationFilter = this._user.totalUsersFilter - 5;
      else {
        let pages = Math.floor(this._user.totalUsersFilter / 5);
        this._user.fromPaginationFilter = pages * 5;
      }
    } else
      this._user.fromPaginationFilter = 0;
    this.filter();
  }
  
  public loadPageFilter(value:number):void {
    let fromIndex = this._user.fromPaginationFilter + value;
    if(fromIndex > this._user.totalUsersFilter || fromIndex < 0)
      return;
    this._user.fromPaginationFilter += value;
    this.filter();
  }

  public filter():void {
    if(this.formFilter.valid) {
      this.filtering = true;
      this.usersObs = this._user.filterUsers(this.formFilter.value.name);
    } else
      this.resetAll()
  }

  public updateUser(user:User):void {
    this.updateSubs = this._user.updateUser(user).subscribe(() => this.usersObs = this._user.getAllUsers());
  }

  public deleteUser({ _id }):void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteSubs = this._user.deleteUser(_id).subscribe(() => this.usersObs = this._user.getAllUsers());
      }
    })
  }

}