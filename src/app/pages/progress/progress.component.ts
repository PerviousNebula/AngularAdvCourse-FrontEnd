import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html'
})
export class ProgressComponent implements OnInit {
  public progreso1:number;
  public progreso2:number;

  constructor() {
    this.progreso1 = 50;
    this.progreso2 = 20;
  }

  ngOnInit() {
  }

}
