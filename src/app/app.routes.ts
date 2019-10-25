//Modules
import { RouterModule, Routes } from "@angular/router";

//Components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';

const ROUTES:Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];

export const APP_ROUTES = RouterModule.forRoot(ROUTES, {useHash: true});