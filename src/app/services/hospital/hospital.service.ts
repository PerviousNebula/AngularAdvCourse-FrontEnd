import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// URL BASE SERVER
import { URL_BASE } from '../../../config/config';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Services
import { UserService } from '../user/user.service';

// Models
import { Hospital } from 'src/app/models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  public totalHospitals:number;
  public fromPagination:number;
  public totalHospitalsFilter:number;
  public fromPaginationFilter:number;


  constructor(private http:HttpClient,
              private _user:UserService) { 
    this.totalHospitals = 0;
    this.fromPagination = 0;
    this.totalHospitalsFilter = 0;
    this.fromPaginationFilter = 0;
  }

  public createHospital(name:string):Observable<Object> {
    return this.http.post(`${URL_BASE}/hospital?token=${this._user.token}`, {name}).pipe(map((res:any) => {
      Swal.fire({
        title: "Hospital Created",
        type: "success",
        text: "The hospital was created successfully!"
      });
      return res;
    }));
  }

  public getAllHospitals():Observable<Object> {
    return this.http.get(`${URL_BASE}/hospital?from=${this.fromPagination}`).pipe(map((res:any) => {
      this.totalHospitals = res.total;
      return res.hospitals;
    }));
  }

  public getSingleHospital(id:string):Observable<Object> {
    return this.http.get(`${URL_BASE}/hospital/${id}`).pipe(map((resp:any) => resp.hospital));
  }

  public updateHospital(hospital:Hospital):Observable<Object> { 
    const URL = `${URL_BASE}/hospital/${hospital._id}?token=${this._user.token}`;
    return this.http.put(URL, {name: hospital.name}).pipe(map((res:any) => {
      Swal.fire({
        title: "Hospital Updated",
        type: "success",
        text: "The hospital was updated successfully"
      });
      return res;
    }));
  }

  public deleteHospital(id:string):Observable<Object> {
    return this.http.delete(`${URL_BASE}/hospital/${id}?token=${this._user.token}`).pipe(map((res:any) => {
      Swal.fire({
        title: "Hospital Deleted",
        type: "success",
        text: "The hospital has been removed successfully!"
      });
      return res;
    }))
  }

  public filterHospitals(hint:string):Observable<Object> {  
    const URL = `${URL_BASE}/search/collection/hospitals/${hint}?from=${this.fromPaginationFilter}`;
    return this.http.get(URL).pipe(map((resp:any) => {
      this.totalHospitalsFilter = resp.total;
      return resp.hospitals;
    }));
  }

}
