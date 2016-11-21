import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../../common/headers';
import { config } from '../../common/config';

declare var jQuery: JQueryStatic;
const template = require('./change.html');
const jwt_decode = require('jwt-decode');

@Component({
  selector: 'change',
  template: template
})

/**
 * 회원가입 수정 가이드 페이지
 */
export class Change {
  jwt:string;
  decodedJwt: any;
  public data;
  // 일반 정보
  email: string;
  telephones: string;
  memberType: number;
  // 사업주 정보
  contacts:string;
  companyNames:string;
  ownerNames:string;
  bizRegNos:string;
  workPlaces:string;
  mainWorkFields:string;
  mainWorkAreas:string;

  constructor(private router: Router, public http: Http, private el: ElementRef) {
  }

  ngOnInit() {
    this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기

    if (!this.jwt) {
      alert('로그인이 필요합니다.');
          
      this.router.navigate(["/"]);
      // 로그인 안된 경우 홈으로
    } else {
      this.decodedJwt = this.jwt && jwt_decode(this.jwt); //jwt값 decoding
      if (!contentHeaders.get('Authorization')) contentHeaders.append('Authorization',this.jwt); //Header에 jwt값 추가하기

      let URL = [config.serverHost, config.path.changeSignup, this.decodedJwt.idx].join('/');

      this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
        .map(res => res.json())//받아온 값을 json형식으로 변경
        .subscribe(
          response => {
            this.data = response //해당값이 제대로 넘어오는지 확인후 프론트단에 내용 추가
            this.email = this.data.user.email;
            this.telephones = this.data.user.telephone;
            this.memberType = this.data.user.memberType;
            
            // 사업주 정보 받기
            if (this.memberType == 2) {
              let URL = [config.serverHost, config.path.changeBizSignup, this.decodedJwt.idx].join('/');

              this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
                .map(res => res.json()) //받아온 값을 json형식으로 변경
                .subscribe(
                  response => {
                    this.data = response; //해당값이 제대로 넘어오는지 확인후 프론트단에 내용 추가
                    //console.log(this.data);
                    this.contacts = this.data.bizUserInfo.contact;
                    this.companyNames = this.data.bizUserInfo.companyName;
                    this.ownerNames = this.data.bizUserInfo.ownerName;
                    this.bizRegNos = this.data.bizUserInfo.bizRegNo;
                    this.workPlaces = this.data.bizUserInfo.workPlace;
                    this.mainWorkFields = this.data.bizUserInfo.mainWorkField;
                    this.mainWorkAreas = this.data.bizUserInfo.mainWorkArea;
                  },
                  error => {
                    alert(error.text());
                    console.log(error.text());
                    //서버로부터 응답 실패시 경고창
                    
                    // 권한이 없으므로 홈으로 이동
                    this.router.navigate(['/']);
                  }
                );
            }
          },
          error => {
            alert(error.text());
            console.log(error.text());
            // 서버로부터 응답 실패시 경고창
            
            this.router.navigate(["/"]);
            // 잘못된 경우 홈으로 보냄
          }
        );
    }
  }

  signupchange(event, email, password, password_ok, telephone, companyName, ownerName, bizRegNo, contact, workPlace, mainWorkField, mainWorkArea) {
    // 필수 입력 체크 
    
    var require = {email, password, password_ok}; // 이메일, 패스워드, 패스워드 확인을 필수로 입력해야 함.

    for (var e in require) {
      if (require[e] == "") {
        var msg;
        switch (e) {
          case "email": msg = "이메일을 입력해 주십시오."; break;
          case "password": msg = "비밀번호를 입력해 주십시오."; break;
          case "password_ok": msg = "비밀번호 확인을 입력해 주십시오."; break;
        }

        // 출력 후 종료
        alert(msg); return;
      }
    }

    //html에서의 value값
    var memberType = this.memberType;
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
    } else if (telephone && !telephone.match(/^\d{3}-\d{3,4}-\d{4}$/)) {
      // 연락처 형식 확인
      alert('올바른 연락처를 사용해 주세요.');
    } else {
      // 일반정보 수정
      let body = JSON.stringify({email, password, telephone, memberType});
      //html받은 값들을 json형식으로 저장

      let URL = [config.serverHost, config.path.changeSignup, this.decodedJwt.idx].join('/');

      console.log(contentHeaders);
      this.http.put(URL, body, {headers: contentHeaders})
        .subscribe(
          response => {
            localStorage.setItem('id_token', response.json().id_token);
            this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
            if (contentHeaders.get('Authorization')) {
              contentHeaders.delete('Authorization'); //기존에 jwt값을 지우기 위해 실행
              contentHeaders.append('Authorization',this.jwt);
            }
            this.router.navigate(['/mainPage']);
            //서버로부터 응답 성공시 mainPage으로 이동
          },
          error => {
            alert(error.text());
            console.log(error.text());
            //서버로부터 응답 실패시 경고창
          }
        );
      
      // 사업주 정보 수정
      if (memberType == 2) {
        let body = JSON.stringify({ contact, companyName, ownerName, bizRegNo, workPlace, mainWorkField, mainWorkArea, memberType });
        //html받은 값들을 json형식으로 저장

        let URL = [config.serverHost, config.path.changeBizSignup, this.decodedJwt.idx].join('/');

        this.http.put(URL, body, { headers: contentHeaders })
          .subscribe(
            response => {
              this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
              if (contentHeaders.get('Authorization')) {
                contentHeaders.delete('Authorization');//기존에 jwt값을 지우기 위해 실행
                contentHeaders.append('Authorization',this.jwt);
              }
              this.router.navigate(['/mainPage']);
              //서버로부터 응답 성공시 home으로 이동
            },
            error => {
              alert(error.text());
              console.log(error.text());
              //서버로부터 응답 실패시 경고창
            }
          );
      }
    }
  }
}
