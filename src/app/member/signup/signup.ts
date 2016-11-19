import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../../common/headers';
import { config } from '../../common/config';

declare var jQuery: JQueryStatic;
const template = require('./signup.html');
const jwt_decode = require('jwt-decode');

/**
 * 로그인 상태에서 회원가입 가능함
 */
@Component({
  selector: 'signup',
  template: template
})
export class Signup {
  constructor(public router: Router, public http: Http, private el: ElementRef) {
  }
  signup(event, email, password, password_ok) {
    //html에서의 value값
    var passwords = password;
    var confirmpasswords = password_ok;
    var pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    if (!email.match(pattern)) {
      // 이메일 형식 체크
      alert('올바른 이메일을 사용해 주십시오.');
    } else if (passwords.length < 8) {
      // 비밀번호 길이 체크
      alert('비밀번호는 최소 8자리여야 합니다.');
    } else if (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(passwords)) {
      // 비밀번호 특수문자 체크
      alert('비밀번호에 특수문자는 사용하실 수 없습니다.');
    } else if (passwords !== confirmpasswords) {
      // password 일치하는지 점검
      alert('비밀번호가 일치하지 않습니다');
    } else {
      // event.preventDefault();
      // memberType을 가져옴
      let memberType = jQuery(this.el.nativeElement).find('#member-type-select input:checked').val();

      let body = JSON.stringify({ email, password,  memberType });

      let URL = [config.serverHost, config.path.signup].join('/');
      console.log('businessSignup URL : ' + URL);
      // html받은 값들을 json형식으로 저장
      this.http.post(URL, body, { headers: contentHeaders })
        .subscribe(
          response => {
            this.router.navigate(['/login']);
            // 서버로부터 응답 성공시 home으로 이동
          },
          error => {
            alert(error.text());
            console.log(error.text());
            // 서버로부터 응답 실패시 경고창
          }
        );
    }
  }
  
  social() {
    alert("준비중입니다");
  }
}
