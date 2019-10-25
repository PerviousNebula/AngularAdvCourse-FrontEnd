import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router:Router, private _user:UserService) { }
  
  canActivate():boolean {
    const TOKEN = localStorage.getItem("token") || "";
    if(!TOKEN.length) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
