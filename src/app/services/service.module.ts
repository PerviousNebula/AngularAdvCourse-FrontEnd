import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//Services
import { 
  SettingsService, 
  SidebarService, 
  SharedService, 
  UserService,
  LoginGuard,
  UploadFileService
} from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UserService,
    LoginGuard,
    UploadFileService
  ]
})
export class ServiceModule { }
