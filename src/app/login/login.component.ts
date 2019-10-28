import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';

declare function init_plugins();
declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email:string;
  public rememberMe:Boolean;
  public auth2:any;

  constructor(private router:Router, private _user:UserService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem("email") || "";
    this.rememberMe = this.email.length > 0;
  }

  public googleInit():void {
    gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id: "94127214828-8ddriu215bcmtdi0apj5d20hbkvfplfs.apps.googleusercontent.com",
        cookiepolicy: "single_host_origin",
        scope: "profile email"
      });
      this.attachSignIn(document.getElementById("btnGoogle"));
    });
  }

  public attachSignIn(element:HTMLElement):void {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      const TOKEN = googleUser.getAuthResponse().id_token;
      this._user.googleSignIn(TOKEN).subscribe(() => window.location.href = '#/dashboard');
    });
  }

  public login(form:NgForm):void {
    if(form.invalid)
      return;
    const USER = new User(null,form.value.email,form.value.password);
    this._user.logInUser(USER, form.value.rememberMe).subscribe(() => this.router.navigate(['/dashboard']));
  }

}
