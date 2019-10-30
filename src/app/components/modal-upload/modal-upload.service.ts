import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {
  public userType:string;
  public id:string;
  public hidden:boolean;
  public notification:EventEmitter<any>;

  constructor() { 
    this.userType = "";
    this.id = "";
    this.hidden = true;
    this.notification = new EventEmitter()
  }

  public hideModal():void { 
    this.hidden = true;
    this.userType = "";
    this.id = "";
  }

  public showModal(userType:string, id:string):void { 
    this.hidden = false;
    this.userType = userType;
    this.id = id;
  }
}
