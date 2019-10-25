import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, pipe, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html'
})
export class RxjsComponent implements OnInit, OnDestroy {
  subscription:Subscription;

  constructor() {     
    this.subscription = this.returnObs().pipe(
      //retry(2)
    ).subscribe(
      numero => console.log("Subs", numero),
      error => console.error("Error en el obs", error),
      () => console.log("El observador termino")
    );
  }

  ngOnInit() {
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public returnObs():Observable<any> {
    return new Observable(observer => {
      let contador = 0;
      let intervalo = setInterval(() => {
        contador++;
        const salida = {
          value: contador
        };
        observer.next(salida);
        // if (contador == 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
        // if (contador == 2) {
        //   //clearInterval(intervalo);
        //   observer.error("Auxilio!");
        // }
      }, 1000);
    }).pipe(
      map((resp:any) => resp.value),
      filter((value, index) => (value % 2) ? true : false)
    );
  }

}
