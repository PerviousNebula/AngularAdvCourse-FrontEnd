import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.css']
})
export class NopagefoundComponent implements OnInit {
  public currentYear:number;
  
  constructor() { 
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
  }

}
