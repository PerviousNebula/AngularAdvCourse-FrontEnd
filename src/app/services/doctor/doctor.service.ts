import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';

// Config
import { URL_BASE } from 'src/config/config';

// Services
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  public totalDoctorsPagination:number;
  public fromPagination:number;
  public totalDoctorsPaginationFilter:number;
  public fromPaginationFilter:number;

  constructor(private http:HttpClient,
              private _user:UserService) { 
    this.totalDoctorsPagination = 0;
    this.fromPagination = 0;
    this.totalDoctorsPaginationFilter = 0;
    this.fromPaginationFilter = 0;
  }

  public createDoctor(name:string, hospitalId:string) {
    const URL = `${URL_BASE}/doctor?token=${this._user.token}`;
    return this.http.post(URL, {name, hospitalId}).pipe(map((resp:any) => {
      Swal.fire({
        title: "Doctor Created",
        type: "success",
        text: "The doctor was created successfully!"
      });
      return resp.doctorSaved;
    }))
  }

  public updateDoctor(id:string, name:string, hospital:string):Observable<Object> {
    const URL = `${URL_BASE}/doctor/${id}?token=${this._user.token}`;
    return this.http.put(URL, {name, hospital}).pipe(map((resp:any) => {
      Swal.fire({
        title: "Doctor Updated",
        type: "success",
        text: "The doctor was updated successfully!"
      });
      return resp.doctorUpdated;
    }));
  }

  public getAllDoctors():Observable<Object> {    
    return this.http.get(`${URL_BASE}/doctor?from=${this.fromPagination}`).pipe(map((resp:any) => {
      this.totalDoctorsPagination = resp.total;
      return resp.doctors;
    }));
  }

  public getSingleDoctor(id:string):Observable<Object> {
    return this.http.get(`${URL_BASE}/doctor/${id}`).pipe(map((resp:any) => resp.doctor));
  }

  public filterDoctors(hint:string):Observable<Object> {
    const URL = `${URL_BASE}/search/collection/doctors/${hint}?from=${this.fromPaginationFilter}`;
    return this.http.get(URL).pipe(map((resp:any) => {
      this.totalDoctorsPaginationFilter = resp.total;
      return resp.doctors;
    }));
  }

  public deleteDoctor(id:string):Observable<Object> {
    const URL = `${URL_BASE}/doctor/${id}?token=${this._user.token}`;
    return this.http.delete(URL).pipe(map((resp:any) => {
      Swal.fire({
        title: "Doctor deleted",
        type: "success",
        text: "The doctor was deleted successfully!"
      });
      return resp.doctor;
    }))
  }

}
