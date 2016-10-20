import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

const template = require('./signup.html');

@Component({
  selector: 'signup',
  template: template
})
export class Signup {
  constructor(public router: Router, public http: Http) {
  }

}
