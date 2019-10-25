import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html'
})
export class IncrementadorComponent implements OnInit {
  @ViewChild('inputProgress', {static: false}) public inputProgress: ElementRef;
  @Input() public progreso:number;
  @Input('nombre') public leyenda:string;
  @Output() public cambioValor:EventEmitter<number>;

  constructor() {
    this.progreso = 50;
    this.leyenda = "Leyenda";
    this.cambioValor = new EventEmitter();
  }

  ngOnInit() {
  }

  public onChanges(nuevoValor:number):void {    
    if(nuevoValor >= 100) 
      this.progreso = 100;
    else if(nuevoValor <= 0)
      this.progreso = 0;
    else
      this.progreso = nuevoValor;
    this.inputProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }

  public cambiarValor(valor:number):void {
    if(this.progreso >= 100 && valor > 0) 
      this.progreso = 100;
    else if(this.progreso <= 0 && valor < 0)
      this.progreso = 0;
    else
      this.progreso += valor;
      this.inputProgress.nativeElement.focus();
    this.cambioValor.emit(this.progreso);
  }

}
