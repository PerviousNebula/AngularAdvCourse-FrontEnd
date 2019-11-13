import { Component, OnInit, OnDestroy } from '@angular/core'
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";;
// Services
import { UploadFileService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html'
})
export class ModalUploadComponent implements OnInit, OnDestroy {
  public imageUploaded:File;
  public imgTemporal:string | ArrayBuffer;
  private modalObs:Subscription

  constructor(public _upload:UploadFileService,
              public _modal:ModalUploadService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {}

  public uploadImg():void { 
    this.modalObs = this._upload.uploadFile(this.imageUploaded, this._modal.userType, this._modal.id)
        .subscribe((resp) => {
          this._modal.notification.emit(resp);
          this._modal.hideModal();
    });
  }

  public closeModal():void {
    this.imageUploaded = null;
    this.imgTemporal = null;
    this._modal.hideModal();
  }

  public selectImg(image:File):void {
    if(!image) {
      this.imageUploaded = null;
      return;
    }
    if(!image.type.includes("image")) {
      this.imageUploaded = null;
      Swal.fire({
        title: "File not supported",
        type: "error",
        text: "The file uploaded is not an image"
      });
      return;
    }
    let reader = new FileReader();
    reader.onload = () => this.imgTemporal = reader.result;
    reader.readAsDataURL(image);    
    this.imageUploaded = image;
  }
}
