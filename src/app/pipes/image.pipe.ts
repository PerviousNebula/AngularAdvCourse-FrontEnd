import { Pipe, PipeTransform } from '@angular/core';
import { URL_BASE } from 'src/config/config';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, userType:string = "users"): any {
    let url = `${URL_BASE}/image`;
    // Default image is the url is not provided
    if(!img)
      return `${url}/default/default`;
    // If the profile picture is from Google sign in
    else if(img.includes("https"))
      return img;
    
    switch(userType) {
      case "users":
        url += `/users/${img}`;
        break;
      
      case "doctors":
        url += `/doctors/${img}`;
        break;
      
      case "hospitals":
        url += `/hospitals/${img}`;
        break;
      
      default:
        url += "default/default";
    }
    return url;
  }
}
