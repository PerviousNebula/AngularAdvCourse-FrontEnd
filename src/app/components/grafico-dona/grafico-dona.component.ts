import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html'
})
export class GraficoDonaComponent implements OnInit {
    @Input() public doughnutChartLabels: Label[];
    @Input() public doughnutChartData: MultiDataSet;
    @Input() public doughnutChartType: ChartType;

  constructor() { }

  ngOnInit() {
  }

}
