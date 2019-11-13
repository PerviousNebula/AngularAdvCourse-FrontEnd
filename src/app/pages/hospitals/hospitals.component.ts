import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

// Models
import { Hospital } from 'src/app/models/hospital.model';

// Services
import { HospitalService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html'
})
export class HospitalsComponent implements OnInit, OnDestroy {
  public filtering:Boolean;
  public hospitalObs:Observable<Object>;
  public hospitalCreateSubs:Subscription;
  public hospitalUpdateSubs:Subscription;
  public hospitalDeleteSubs:Subscription;
  public modalObs:Subscription;
  public hospitalFilter:FormGroup;

  constructor(public _hospital:HospitalService,
              public _modal:ModalUploadService) {
    this.hospitalFilter = new FormGroup({
      name: new FormControl("",Validators.required)
    });
    this.filtering = false;
  }

  ngOnInit() {
    this.hospitalObs = this._hospital.getAllHospitals();
    this.modalObs = this._modal.notification.subscribe(() => this.hospitalObs = this._hospital.getAllHospitals());
  }

  ngOnDestroy() {}

  public resetForm():void {
    this.hospitalFilter.reset();
    this.filtering = false;
    this._hospital.fromPagination = 0;
    this._hospital.fromPaginationFilter = 0;
    this.hospitalObs = this._hospital.getAllHospitals();
  }

  public loadPage(value:number):void {
    let fromIndex = this._hospital.fromPagination + value;
    if(fromIndex > this._hospital.totalHospitals || fromIndex < 0)
      return;
    this._hospital.fromPagination += value;
    this.hospitalObs = this._hospital.getAllHospitals();
  }
  
  public loadPageFilter(value:number):void {
    let fromIndex = this._hospital.fromPaginationFilter + value;
    if(fromIndex > this._hospital.totalHospitalsFilter || fromIndex < 0)
      return;
    this._hospital.fromPaginationFilter += value;
    this.filterHospitals();
  }

  public goToLimit(limit:number):void {
    if(limit) {
      const NOT_PAGES_REMAINDER = this._hospital.totalHospitals % 5;
      if(!NOT_PAGES_REMAINDER)
        this._hospital.fromPagination = this._hospital.totalHospitals - 5;
      else {
        let pages = Math.floor(this._hospital.totalHospitals / 5);
        this._hospital.fromPagination = pages * 5;
      }
    } else
      this._hospital.fromPagination = 0;
    this.hospitalObs = this._hospital.getAllHospitals();
  }
  
  public goToLimitFilter(limit:number):void {
    if(limit) {
      const NOT_PAGES_REMAINDER = !(this._hospital.totalHospitalsFilter % 5)
      if(NOT_PAGES_REMAINDER)
        this._hospital.fromPaginationFilter = this._hospital.totalHospitalsFilter - 5;
      else {
        let pages = Math.floor(this._hospital.totalHospitalsFilter / 5);
        this._hospital.fromPaginationFilter = pages * 5;
      }
    } else
      this._hospital.fromPaginationFilter = 0;
    this.filterHospitals();
  }

  public filterHospitals():void {
    if (this.hospitalFilter.valid) {
      this.filtering = true;
      this.hospitalObs = this._hospital.filterHospitals(this.hospitalFilter.value.name);
    } else {
      this.filtering = false;
      this.hospitalObs = this._hospital.getAllHospitals();
    }
  }

  public async createHospital():Promise<void> {
    const { value: name } = await Swal.fire({
      title: 'Create Hospital',
      input: 'text',
      inputPlaceholder: 'Enter the hospital name'
    });    
    if (name)
      this.hospitalCreateSubs = this._hospital.createHospital(name).subscribe(() => this.hospitalObs = this._hospital.getAllHospitals());
    else
      Swal.fire({ title: "Empty name", type: "warning", text: "The hospital name field is a must" });
  }

  public updateHospitalName(hospital:Hospital):void {
    if(hospital.name)
      this.hospitalUpdateSubs = this._hospital.updateHospital(hospital).subscribe();
    else
      Swal.fire({
        title: "The name field is a must",
        type: "warning",
        text: "The name field cannot be empty!"
      });
  }

  public deleteHospital(hospital:Hospital):void {
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
        this.hospitalDeleteSubs = this._hospital.deleteHospital(hospital._id).subscribe(() => this.hospitalObs = this._hospital.getAllHospitals());    
    })
  }

}
