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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public HTTP_USER_URL:string;
  public HTTP_LOGIN_URL:string;

  constructor(private http:HttpClient, private router:Router) { 
    this.HTTP_USER_URL = `${URL_BASE}/user`;
    this.HTTP_LOGIN_URL = `${URL_BASE}/login`;
  }

  public saveInLocalStorage(id:string, token:string, user:User):void {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
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
}
