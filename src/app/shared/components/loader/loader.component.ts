import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
 	@Input() showLoader: boolean;
 	@Input() loaderText;
  @Input() progressIndex : number = 0;
  mode : string = "determinate";
  
  constructor() { }

  ngOnInit() {
    this.styleElement = document.createElement('style');
    this.changeColors();
  }

  styleElement: HTMLStyleElement;
  changeColors() {
    const head = document.getElementsByTagName('head')[0];
    const css = `
    .style1 .mat-progress-bar-fill::after {
      height: 25px;
      border-radius: 15px;
      background-color: primary !important;
    }`;
    this.styleElement.innerHTML = '';
    this.styleElement.type = 'text/css';
    this.styleElement.appendChild(document.createTextNode(css));
    head.appendChild(this.styleElement);
  
  }
}
