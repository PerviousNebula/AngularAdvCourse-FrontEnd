import { Component, OnInit } from '@angular/core';

//Services
import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor(private _settings:SettingsService) { }

  ngOnInit() {
    this.initCheck();
  }

  public changeTheme(theme:string, link:HTMLElement):void {
    this.applyCheck(link);    
    this._settings.applyUserTheme(theme);
  }

  public applyCheck(link:HTMLElement):void {
    const THEME_SELECTORS:Array<Element> = Array.from(document.getElementsByClassName("selector"));
    for (const SELECTOR of THEME_SELECTORS) 
      SELECTOR.classList.remove("working");
    link.classList.add("working");
  }
  
  public initCheck():void {
    const THEME_SELECTORS:Array<Element> = Array.from(document.getElementsByClassName("selector"));
    for (const SELECTOR of THEME_SELECTORS) {
      if(SELECTOR.getAttribute("data-theme") == this._settings.settings.theme) {
        SELECTOR.classList.add("working");
        break;
      }
    }
  }

}
