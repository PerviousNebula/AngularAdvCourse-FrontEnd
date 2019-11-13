import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import Swal from 'sweetalert2';

// Services
import { DoctorService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

// Models
import { Doctor } from 'src/app/models/doctor.model';

@AutoUnsubscribe()
@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html'
})
export class DoctorsComponent implements OnInit, OnDestroy {
  public doctorFilter:FormGroup;
  private doctorsObs:Observable<Object>;
  private modalSub:Subscription;
  private deleteDoctorSubs:Subscription;
  public filtering:Boolean;

  constructor(public _doctors:DoctorService,
              public _modal:ModalUploadService) { 
    this.doctorFilter = new FormGroup({
      name: new FormControl("",Validators.required)
    });
    this.filtering = false;
  }

  ngOnInit() {
    this.doctorsObs = this._doctors.getAllDoctors();
    this.modalSub = this._modal.notification.subscribe(() => this.doctorsObs = this._doctors.getAllDoctors());
  }

  ngOnDestroy() {}

  public resetAll():void {
    this._doctors.fromPagination = 0;
    this._doctors.fromPaginationFilter = 0;
    this.filtering = false;
    this.doctorFilter.reset();
    this.doctorsObs = this._doctors.getAllDoctors();
  }

  public filterDoctors():void {
    if (this.doctorFilter.valid) {
      this.filtering = true;
      this.doctorsObs = this._doctors.filterDoctors(this.doctorFilter.value.name);
    } else {
      this.filtering = false;
      this.doctorsObs = this._doctors.getAllDoctors();
    } 
  }

  public deleteDoctor(doctor:Doctor):void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value)
        this.deleteDoctorSubs = this._doctors.deleteDoctor(doctor._id).subscribe(() => this.resetAll());
    });
  }

  public goToLimit(value:number):void {
    if(value) {
      const NOT_PAGES_REMAINDER = this._doctors.totalDoctorsPagination % 5;
      if(!NOT_PAGES_REMAINDER)
        this._doctors.fromPagination = this._doctors.totalDoctorsPagination - 5;
      else {
        let pages = Math.floor(this._doctors.totalDoctorsPagination / 5);
        this._doctors.fromPagination = pages * 5;
      }
    } else
      this._doctors.fromPagination = 0;  
    this.doctorsObs = this._doctors.getAllDoctors();
  }
  
  public goToLimitFilter(value:number):void {
    if(value) {
      const NOT_PAGES_REMAINDER = this._doctors.totalDoctorsPaginationFilter % 5;
      if(!NOT_PAGES_REMAINDER)
        this._doctors.fromPaginationFilter = this._doctors.totalDoctorsPaginationFilter - 5;
      else {
        let pages = Math.floor(this._doctors.totalDoctorsPaginationFilter / 5);
        this._doctors.fromPaginationFilter = pages * 5;
      }
    } else
      this._doctors.fromPaginationFilter = 0;  
    this.filterDoctors();
  }

  public loadPage(pages:number):void {
    const PAGES_INDEX = this._doctors.fromPagination + pages;
    if(PAGES_INDEX > this._doctors.totalDoctorsPagination || PAGES_INDEX < 0)
      return;
    this._doctors.fromPagination = PAGES_INDEX;
    this.doctorsObs = this._doctors.getAllDoctors();
  }
  
  public loadPageFilter(pages:number):void {
    const PAGES_INDEX = this._doctors.fromPaginationFilter + pages;
    if(PAGES_INDEX > this._doctors.totalDoctorsPaginationFilter || PAGES_INDEX < 0)
      return;
    this._doctors.fromPaginationFilter = PAGES_INDEX;
    this.filterDoctors();
  }

}
