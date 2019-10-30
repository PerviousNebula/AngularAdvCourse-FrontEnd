import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';

//Plugins, Google and Facebook login
declare function init_plugins();
declare var FB: any;
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
    this.fbInit();
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

  public fbInit():void {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '393273418285146',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  public attachSignIn(element:HTMLElement):void {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      const TOKEN = googleUser.getAuthResponse().id_token;
      this._user.googleSignIn(TOKEN).subscribe(() => window.location.href = '#/dashboard');
    });
  }

  public loginFB():void {
    FB.login((response) => {
      console.log(response);
      this.testAPI();        
    }, {scope: 'public_profile,email'});
  }

  public testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      console.log("data", response);      
    });
  }

  public login(form:NgForm):void {
    if(form.invalid)
      return;
    const USER = new User(null,form.value.email,form.value.password);
    this._user.logInUser(USER, form.value.rememberMe).subscribe(() => this.router.navigate(['/dashboard']));
  }

}
