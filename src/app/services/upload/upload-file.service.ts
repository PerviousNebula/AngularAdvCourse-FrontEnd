import { Injectable } from '@angular/core';
import { URL_BASE } from '../../../config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private http:HttpClient) { }

  public uploadFile(fileItem:File, type:string, id:string):Observable<Object> {
    const URL = `${URL_BASE}/upload/${type}/${id}`;
    const formData = new FormData();
    formData.append('image', fileItem, fileItem.name);
    return this.http.put(URL, formData, {reportProgress:true});
  }
}
