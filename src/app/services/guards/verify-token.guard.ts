import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyTokenGuard implements CanActivate {

  constructor(private _user:UserService) { }

  canActivate(): Promise<boolean> | boolean {
    const TOKEN = this._user.token;
    const PAYLOAD = JSON.parse(atob(TOKEN.split(".")[1]));
    if(this.isExpired(PAYLOAD.exp)) {
      return false;
    }    
    return this.verifyRenew(PAYLOAD.exp);
  }

  private verifyRenew(exp:number):Promise<boolean> {
    return new Promise((resolve, reject) => {
      const TOKEN_EXP = new Date(exp * 1000);
      const CURRENT_DATE = new Date();
      CURRENT_DATE.setTime(CURRENT_DATE.getTime() + (2 * 60 * 60 * 1000));
      if(TOKEN_EXP.getTime() > CURRENT_DATE.getTime())
        resolve(true);
      else
        this._user.renewUserToken().subscribe(() => resolve(true), () => reject(false));
    });
  }

  private isExpired(exp:number):boolean {
    const CURRENT_DATE = new Date().getTime() / 1000;
    return exp < CURRENT_DATE;
  }
  
}
