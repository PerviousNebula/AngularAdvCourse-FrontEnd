import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html'
})
export class PromesasComponent implements OnInit {

  constructor() { 
    this.contarTress().then(
      mensaje => console.log("Termino", mensaje)
    ).catch(error => console.error("Error en la promesa", error));
  }

  ngOnInit() {
  }

  public contarTress():Promise<boolean> {
    return new Promise((resolve, reject) => {
      let contador = 0;
      let intervalo = setInterval(() => {
        contador += 1;
        console.log(contador);
        if(contador == 3) {
          resolve(true);
          clearInterval(intervalo);
        }
      });
    });
  }

}
