/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { contentHeaders } from './common/headers';
import { Router } from '@angular/router';

const template = require('./app.component.html');
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template: template
})
export class AppComponent {
  constructor(public router: Router) {
  }

  ngOnInit() {

  }

  ngAfterContentInit() {    // 로딩때 한번만 뜨는데, life cycle을
    this.setHeaderUserMenu();
    this.loadScript();
  }

  jwt: any;
  logined: boolean;

  logout() {
    //html받은 값들을 json형식으로 저장
    localStorage.removeItem('id_token');
    contentHeaders.delete('Authorization');

    alert("로그아웃 되었습니다.");

    this.router.navigate(['/']);
    this.setHeaderUserMenu();
  }

  setHeaderUserMenu() {
    this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
    if (this.jwt) {
      this.logined = true;
    } else {
      this.logined = false;
    }
  }

  public loadScript() {
    const url = "assets/js-canvas/functions.js";

    console.log('preparing to load...');
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.defer = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
