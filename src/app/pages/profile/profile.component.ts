import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// Models
import { User } from 'src/app/models/user.model';
// Services
import { UserService } from 'src/app/services/service.index';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  public userInfo:User;
  public profile:FormGroup;
  public isLoading:Boolean;
  public imageUploaded:File;
  public imgTemporal:string | ArrayBuffer;

  constructor(private _user:UserService) {
    this.isLoading = false;
    this.userInfo = this._user.user;
    this.profile = new FormGroup({
      name: new FormControl(this.userInfo.name,[Validators.required]),
      email: new FormControl({value: this.userInfo.email, disabled: this.userInfo.google},
                             [Validators.required,Validators.email])
    });
  }

  ngOnInit() {
  }

  public update():void {
    if(this.profile.valid) {
      this.userInfo.name = this.profile.value.name;
      if(!this.userInfo.google)
        this.userInfo.email = this.profile.value.email;
      this.isLoading = true;
      this._user.updateUser(this.userInfo).subscribe(() => this.isLoading = false);
    }
  }

  public selectImg(image:File):void {
    if(!image) {
      this.imageUploaded = null;
      return;
    }
    if(!image.type.includes("image")) {
      this.imageUploaded = null;
      Swal.fire({
        title: "File not supported",
        type: "error",
        text: "The file uploaded is not an image"
      });
      return;
    }
    let reader = new FileReader();
    reader.onload = () => this.imgTemporal = reader.result;
    reader.readAsDataURL(image);    
    this.imageUploaded = image;
  }

  public updateImage():void {
    this._user.updateProfilePicture(this.imageUploaded, this.userInfo._id);
  }

}
