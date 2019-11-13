import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Router, ActivatedRoute } from '@angular/router';

// Models
import { Doctor } from 'src/app/models/doctor.model';

// Services
import { HospitalService, DoctorService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html'
})
export class DoctorComponent implements OnInit, OnDestroy {
  public editDoctor:Doctor;
  public doctorForm:FormGroup;
  public hospitalsObs:Observable<Object>;
  public hospitalObs:Observable<Object>;
  public doctorSubs:Subscription;
  private createDoctorSubs:Subscription;
  private editDoctorSubs:Subscription;
  private modalSubs:Subscription;

  constructor(public _doctor:DoctorService,
              public _hospitals:HospitalService,
              private _modal:ModalUploadService,
              private router:Router,
              private activatedRoute:ActivatedRoute) { 
    this.doctorForm = new FormGroup({
      name: new FormControl("", Validators.required),
      hospital: new FormControl("", Validators.required)
    });
    this.activatedRoute.params.subscribe(params => {
      if(params['id'] !== 'new')
        this.doctorSubs = this._doctor.getSingleDoctor(params['id']).subscribe((resp:any) => {
          this.doctorForm.patchValue({
            name: resp.name,
            hospital: resp.hospital._id
          });
          this.getHospitalInfo();
          this.editDoctor = resp;
        });
    });
  }

  ngOnInit() {
    this.hospitalsObs = this._hospitals.getAllHospitals();
    this.modalSubs = this._modal.notification.subscribe((resp:any) => this.editDoctor.img = resp.doctorUpdated.img);
  }

  ngOnDestroy() {
  }

  public createDoctor():void {
    if(this.doctorForm.valid && !this.editDoctor)
      this.createDoctorSubs = this._doctor.createDoctor(this.doctorForm.value.name, this.doctorForm.value.hospital)
                                          .subscribe((resp:any) => this.router.navigate(['/doctor', resp._id]));
    else if(this.doctorForm.valid && this.editDoctor)
      this.editDoctorSubs = this._doctor.updateDoctor(this.editDoctor._id,this.doctorForm.value.name,this.doctorForm.value.hospital).subscribe();
  }

  public getHospitalInfo():void {
    this.hospitalObs = this._hospitals.getSingleHospital(this.doctorForm.value.hospital);
  }

}
