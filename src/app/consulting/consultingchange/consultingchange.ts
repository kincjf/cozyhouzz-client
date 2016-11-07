/**
 * Created by InSuJeong on 2016-09-13.
 */
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../../common/headers';
//import * as _ from 'lodash';
import { config } from '../../common/config';
import * as moment from 'moment';

const template = require('./consultingchange.html');

@Component({
  selector: 'consultingChange',
  template: template
})


export class ConsultingChange implements AfterViewInit {
  jwt:string;
  decodedJwt: any;
  public data;
  idx: number;
  public selectedId:number;

  currentTitle: string;
  currentPrefBizMemberIdx: number;
  currentUserName: string;
  currentTelephone: string;
  currentEmail: string;
  currentBuildType: string;
  currentBuildPlace: string;
  currentLived: number;
  currentExpectBuildTotalArea: number;
  currentExpectBuildPrice: number;
  currentExpectConsultDate: string;
  currentExpectBuildStartDate: string;
  currentReqContents: string;

  /*
   Component 역할 : 시공사례 글 입력
   작업상황 :
   - 다음 우편 API 사용하여 주소 입력 받기(완료)
   차후 개선방안 :
   - 공사구분, 거주/비거주 값 설정을 서버에 저장된 값으로 되도록 해야함
   - UI개선
   */

  constructor(public router: Router, public http: Http,  private route: ActivatedRoute, private el: ElementRef ) {
    this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);//jwt값 decoding
    contentHeaders.set('Authorization',this.jwt);//Header에 jwt값 추가하기
  }


  ngAfterViewInit() {
    this.route.params.forEach((params:Params) => {
      let consultingIdx = +params['consultingIdx'];
      this.selectedId = consultingIdx;
    })

    let URL = [config.serverHost, config.path.consulting, this.selectedId].join('/');

    this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
      .map(res => res.json())//받아온 값을 json형식으로 변경
      .subscribe(
        response => {
          this.data = response; // 해당값이 제대로 넘어오는지 확인후 프론트단에 내용추가

          this.idx = this.data.consult.idx;

          //현재 수정할 정보를 불러오기
          this.currentTitle = this.data.consult.title;
          this.currentPrefBizMemberIdx = this.data.consult.prefBizMemberIdx;
          this.currentUserName = this.data.consult.userName;
          this.currentTelephone = this.data.consult.telephone;
          this.currentEmail = this.data.consult.email;
          this.currentBuildType = this.data.consult.buildType;
          this.currentBuildPlace = this.data.consult.buildPlace;
          this.currentLived = this.data.consult.lived;
          this.currentExpectBuildTotalArea = this.data.consult.expectBuildTotalArea;
          this.currentExpectBuildPrice = this.data.consult.expectBuildPrice;
          this.currentExpectConsultDate = moment(this.data.consult.expectConsultDate).format('YYYY-MM-DD');
          this.currentExpectBuildStartDate = moment(this.data.consult.expectBuildStartDate).format('YYYY-MM-DD');
          this.currentReqContents = this.data.consult.reqContents;
        },
        error => {
          alert(error.text());
          console.log(error.text());
          //서버로부터 응답 실패시 경고창
        }
      );
  }


  consultingchanging(event, title, buildType, userName, telephone, email, expectBuildPrice, buildPlace, buildPostCode, buildPlaceDetail, expectBuildTotalArea, expectBuildStartDate, expectConsultDate, reqContents){
    event.preventDefault();
    //lived에 들어갈 radio버튼에서 체크된 값 가져오기
    // var lived 		= $(':radio[name="optionsRadios"]:checked').val();
    var lived = jQuery(this.el.nativeElement).find(':radio[name="optionsRadios"]:checked').val();
      //우편번호, 주소, 상세주소를 JSON string로 묶음
    buildPlace = JSON.stringify([buildPostCode, buildPlace, buildPlaceDetail]);
    //html받은 값들을 json형식으로 저장
    let body= JSON.stringify({title, buildType, userName, telephone, email, expectBuildPrice, buildPlace, lived, expectBuildTotalArea, expectBuildStartDate, expectConsultDate, reqContents});

    let URL = [config.serverHost, config.path.consulting, this.selectedId].join('/');

    this.http.put(URL, body, {headers: contentHeaders})
      .subscribe(
        response => {
          this.router.navigate(['/consultingMyListInfo']);
          alert("수정 완료");
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
