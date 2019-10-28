import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'

// Models
import { User } from 'src/app/models/user.model';

// URL BASE SERVER
import { URL_BASE } from 'src/config/config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload/upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public HTTP_USER_URL:string;
  public HTTP_LOGIN_URL:string;
  public user:User;
  public token:string;

  constructor(private http:HttpClient, 
              private router:Router, 
              private _uploadFile:UploadFileService) 
  { 
    this.HTTP_USER_URL = `${URL_BASE}/user`;
    this.HTTP_LOGIN_URL = `${URL_BASE}/login`;
    this.loadFromLocalStorage();
  }

  public saveInLocalStorage(id:string, token:string, user:User):void {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.user = user;
    this.token = token;
  }

  public loadFromLocalStorage():void {
    this.user = JSON.parse(localStorage.getItem("user")) || null;
    this.token = localStorage.getItem("token") || "";
  }

  public googleSignIn(token:string):Observable<Object> {
    const URL = `${this.HTTP_LOGIN_URL}/google`;
    return this.http.post(URL, { token }).pipe(map((resp:any) => {
      this.saveInLocalStorage(resp.id,resp.token,resp.user);
      return true;
    }));
  }

  public logInUser(user:User, rememberMe:Boolean):Observable<Object> {
    if(rememberMe)
      localStorage.setItem("email",user.email);
    else
      localStorage.removeItem("email");
    return this.http.post(this.HTTP_LOGIN_URL, user).pipe(map((resp:any) => {
      this.saveInLocalStorage(resp.id,resp.token,resp.user);
      return true;
    }));
  }

  public logOutUser():void {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }

  public createUser(user:User):Observable<Object> {
    return this.http.post(this.HTTP_USER_URL, user).pipe(map((res:any) => {
      Swal.fire({
        title: "Success!",
        text: `The user ${user.email} was created successfully`,
        type: "success"
      });
      return res.userSaved;
    }));
  }

  public updateUser(user:User):Observable<Object> {
    const URL = `${this.HTTP_USER_URL}/${user._id}?token=${this.token}`;
    return this.http.put(URL, user).pipe(map(() => {
      this.saveInLocalStorage(user._id,this.token,user);
      Swal.fire({
        title: "Success",
        type: "success",
        text: "The user has been updated successfully!"
      });
      return true;
    }));
  }

  public updateProfilePicture(file:File, userId:string):void {
    this._uploadFile.uploadFile(file,'users',userId).subscribe((resp:any) => {
      this.user.img = resp.userUpdated.img;
      this.saveInLocalStorage(userId,this.token,this.user);
      Swal.fire({
        title: "Success",
        type: "success",
        text: "Profile picture updated successfully!"
      });
    });
  }
}
