import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2'

// Models
import { User } from 'src/app/models/user.model';

// URL BASE SERVER
import { URL_BASE } from 'src/config/config';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload/upload-file.service';
import { SidebarService } from '../shared/sidebar.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public HTTP_USER_URL:string;
  public HTTP_LOGIN_URL:string;
  public user:User;
  public token:string;
  public fromPagination:number;
  public totalUsers:number;
  public fromPaginationFilter:number;
  public totalUsersFilter:number;

  constructor(private http:HttpClient, 
              private router:Router, 
              private _uploadFile:UploadFileService,
              private _sidebar:SidebarService)
  { 
    this.HTTP_USER_URL = `${URL_BASE}/user`;
    this.HTTP_LOGIN_URL = `${URL_BASE}/login`;
    this.fromPagination = 0;
    this.totalUsers = 0;
    this.fromPaginationFilter = 0;
    this.totalUsersFilter = 0;
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
      this._sidebar.menu = resp.categories;
      return true;
    }));
  }

  public facebookSignIn(access_token:string):Observable<Object> {
    const URL = `${this.HTTP_LOGIN_URL}/facebook`;
    return this.http.post(URL, { access_token }).pipe(map((resp:any) => {
      this.saveInLocalStorage(resp.Id, resp.token, resp.user);
      return true;
    }));
  }

  public logInUser(user:User, rememberMe:Boolean):Observable<Object> {
    if(rememberMe)
      localStorage.setItem("email",user.email);
    else
      localStorage.removeItem("email");
    return this.http.post(this.HTTP_LOGIN_URL, user)
                    .pipe(
                      map((resp:any) => {
                        this.saveInLocalStorage(resp.id,resp.token,resp.user);
                        this._sidebar.menu = resp.categories;
                        return true;
                      }),
                      catchError(err => {
                        Swal.fire({
                          title:"Invalid login",
                          type:"error",
                          text:err.error.message
                        });
                        return throwError(err);
                      }));
  }

  public logOutUser():void {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }

  public createUser(user:User):Observable<Object> {
    return this.http.post(this.HTTP_USER_URL, user)
                    .pipe(
                      map((res:any) => {
                        Swal.fire({
                          title: "Success!",
                          text: `The user ${user.email} was created successfully`,
                          type: "success"
                        });
                        return res.userSaved;
                      }),
                      catchError(err => {
                        Swal.fire({
                          title:err.error.message,
                          type:"error",
                          text:err.error.errors.message
                        });
                        return throwError(err);
                      }));
  }

  public filterUsers(hint:string):Observable<Object> {    
    const URL = `${URL_BASE}/search/collection/users/${hint}?from=${this.fromPaginationFilter}`;
    return this.http.get(URL).pipe(map((resp:any) => {
      this.totalUsersFilter = resp.total;
      return resp.users;
    }));
  }

  public updateUser(user:User):Observable<Object> {
    const URL = `${this.HTTP_USER_URL}/${user._id}?token=${this.token}`;
    return this.http.put(URL, user).pipe(map(() => {
      if(user._id === this.user._id)
        this.saveInLocalStorage(user._id,this.token,user);      
      Swal.fire({
        title: "Success",
        type: "success",
        text: "The user has been updated successfully!"
      });
      return true;
    }));
  }

  public deleteUser(id:string):Observable<Object> {    
    return this.http.delete(`${this.HTTP_USER_URL}/${id}?token=${this.token}`).pipe(map((resp:any) => {
      Swal.fire({
        title: "Success",
        type: "success",
        text: "The user has been removed successfully!"
      });
      this.fromPagination = 0;
      return resp;
    }));
  }

  public getAllUsers():Observable<Object> {
    const URL = `${this.HTTP_USER_URL}?from=${this.fromPagination}`;
    return this.http.get(URL).pipe(map((resp:any) => {
      this.totalUsers = resp.total;
      return resp.users;
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
