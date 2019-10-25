import { Injectable, Inject } from '@angular/core';
import { Settings } from '../../interfaces/interfaces.index';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public settings:Settings;

  constructor(@Inject(DOCUMENT) private _document) { 
    this.settings = {
      themeUrl: "./assets/css/colors/default-dark.css",
      theme: "default-dark"
    };
    this.loadSettings();
  }

  public saveSettings():void {
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  public loadSettings():void {
    if(localStorage.getItem("settings")) {
      this.settings = JSON.parse(localStorage.getItem("settings"));
      this.applyUserTheme(this.settings.theme);
    } else
      this.applyUserTheme(this.settings.theme);
  }

  public applyUserTheme(theme:string):void {
    const HREF:string = `/assets/css/colors/${theme}.css`;    
    this._document.getElementById("theme").setAttribute("href", HREF);
    this.settings.themeUrl = HREF;
    this.settings.theme = theme;
    this.saveSettings();
  }
}
