//Modules
import { RouterModule, Routes } from '@angular/router';

//Components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Graficas1Component } from './graficas1/graficas1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
// import { NopagefoundComponent } from '../shared/nopagefound/nopagefound.component';

// Guards
import { LoginGuard } from '../services/guards/login.guard';
import { UsersComponent } from './users/users.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { DoctorComponent } from './doctor/doctor.component';

const ROUTES:Routes = [
    { 
        path: '', 
        component:PagesComponent,
        canActivate: [LoginGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data:{title:"Dashboard", desc:"Main menu of the app, useful information only"}},
            { path: 'graficas1', component: Graficas1Component, data:{title:"Charts", desc:"Useful charts for the user"} },
            { path: 'progreso', component: ProgressComponent, data:{title:"Progress", desc:"Customizables and animated progresses controls"} },
            { path: 'account-settings', component: AccountSettingsComponent, data:{title:"Theme Settings", desc:"Customizables app theme colors"} },
            { path: 'promesas', component: PromesasComponent, data:{title:"Promises", desc:"Async managment with promises"} },
            { path: 'rxjs', component: RxjsComponent, data:{title:"RxJS", desc:"Async managment with observables from RxJS library"} },
            { path: 'profile', component: ProfileComponent, data:{title:"My profile", desc:"User's personal information and profile picture"} },
            { path: 'users', component: UsersComponent, data:{title:"Users Managment", desc:"Search, filter, remove and edit current system's users"} },
            { path: 'hospitals', component: HospitalsComponent, data:{title:"Hospitals Managment", desc:"Search, filter, remove and edit system's hospitals"} },
            { path: 'doctors', component: DoctorsComponent, data:{title:"Doctors Managment", desc:"Search, filter, remove and edit system's doctors"} },
            { path: 'doctor/:id', component: DoctorComponent, data:{title:"Edit Doctor", desc:"Edit general purpose doctor information"} },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }/*,
            { path: '**', component: NopagefoundComponent }*/
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(ROUTES);