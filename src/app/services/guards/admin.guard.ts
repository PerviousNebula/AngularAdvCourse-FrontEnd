import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// Services
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _user:UserService,
              private router:Router) { }

  canActivate(): boolean {
    if(this._user.user.role == "ADMIN_ROLE") {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
  
}
