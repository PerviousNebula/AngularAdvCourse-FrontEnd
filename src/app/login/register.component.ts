import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  public signUpForm: FormGroup;

  constructor(private _user:UserService, private router:Router) { }

  ngOnInit() {
    init_plugins();

    this.signUpForm = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)]),
      password2: new FormControl("", [Validators.required, Validators.minLength(6)]),
      terms: new FormControl(false)
    }, { validators: this.mismatchPasswordValidator });

    this.signUpForm.setValue({
      name: "Test",
      email: "test@test.com",
      password: "123456",
      password2: "123456",
      terms: true
    });
  }

  private mismatchPasswordValidator(signUpForm:FormGroup):any {
    let password1 = signUpForm.controls['password'].value;
    let password2 = signUpForm.controls['password2'].value;
    return (password1 === password2) ? null : {equals:true}
  }

  public signUp():void {
    if(this.signUpForm.invalid)
      return;
    if(!this.signUpForm.value.terms) {
      Swal.fire({
        title: "Important!",
        text: "You must agree with our terms and conditions to proceed the registration",
        type: "warning"
      });
      return;
    }
    const NEW_USER = new User(this.signUpForm.value.name, this.signUpForm.value.email, this.signUpForm.value.password);
    this._user.createUser(NEW_USER).subscribe(resp => this.router.navigate(['/login']));
  }

}
