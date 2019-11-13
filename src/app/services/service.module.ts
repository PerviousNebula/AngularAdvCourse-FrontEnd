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
  UploadFileService,
  HospitalService,
  DoctorService
} from './service.index';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

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
    UploadFileService,
    HospitalService,
    ModalUploadService,
    DoctorService
  ]
})
export class ServiceModule { }
