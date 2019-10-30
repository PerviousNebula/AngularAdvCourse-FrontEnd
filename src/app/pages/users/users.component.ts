import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/service.index';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.model';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  public usersObs:Observable<Object>;
  private updateObs:Subscription;
  private deleteObs:Subscription;
  private modalObs:Subscription;
  public formFilter:FormGroup;

  constructor(public _user:UserService, 
              public _modal:ModalUploadService) { 
    this.formFilter = new FormGroup({
      name: new FormControl(""),
      email: new FormControl("", [Validators.email])
    });    
  }

  ngOnInit() {
    this.usersObs = this._user.getAllUsers();
    this.modalObs = this._modal.notification.subscribe(() => this.usersObs = this._user.getAllUsers());
  }
  
  ngOnDestroy() {
    if(this.deleteObs)
      this.deleteObs.unsubscribe();
    if(this.updateObs)
      this.updateObs.unsubscribe();
    if(this.modalObs)
      this.modalObs.unsubscribe();
  }

  public loadPage(value:number):void {
    let fromIndex = this._user.fromPagination + value;
    if(fromIndex > this._user.totalUsers || fromIndex < 0)
      return;
    this._user.fromPagination += value;
    this.usersObs = this._user.getAllUsers();
  }

  public filter():void {
    if(this.formFilter.valid) {
      if(this.formFilter.value.name)
        this.usersObs = this._user.filterUsers(this.formFilter.value.name);
      else
        this.usersObs = this._user.getAllUsers();
    }
  }

  public updateUser(user:User):void {
    this.updateObs = this._user.updateUser(user).subscribe(() => this.usersObs = this._user.getAllUsers());
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
        this.deleteObs = this._user.deleteUser(_id).subscribe(() => this.usersObs = this._user.getAllUsers());
      }
    })
  }

}