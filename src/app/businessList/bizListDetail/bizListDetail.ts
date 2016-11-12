/**
 * Created by insu on 2016-09-02.
 */
import {Component} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Http} from '@angular/http';

import {contentHeaders} from '../../common/headers';
import {config} from '../../common/config';

const template = require('./bizListDetail.html');
const jwt_decode = require('jwt-decode');

@Component({
    selector: 'bizListDetail',
    template: template
})

export class BizListDetail {
    decodedJwt: any;
    jwt:string;
    public data;
    public selectedId:number;

    serverHost:string;
    companyIntroImage: string;
    mainPreviewImage:string;
    companyName:string;
    aboutCompany:string;
    mainWorkField:string;
    mainWorkArea:string;
    email:string;
    memberIdx: number;

    /*
     Component 역할 : 업체 정보 상세보기 페이지serverHost: string = config.serverHost;

     작업상황 :
     -
     차후 개선방안 :
     - UI개선
     */


    constructor(public router:Router, public http:Http, private route:ActivatedRoute) {

    }

    ngAfterViewInit() {
        this.route.params.forEach((params:Params) => {
            let bizUserIdx = +params['bizUserIdx'];
            this.selectedId = bizUserIdx;
        });

        this.serverHost = config.serverHost;

        let URL = [config.serverHost, config.path.bizStore, this.selectedId].join('/');

        this.http.get(URL, {headers: contentHeaders}) //서버로부터 필요한 값 받아오기
            .map(res => res.json())//받아온 값을 json형식으로 변경
            .subscribe(
                response => {
                    this.data = response; // 해당값이 제대로 넘어오는지 확인후 프론트단에 내용추가
                    this.companyIntroImage = this.data.bizUserInfo.companyIntroImage;
                    this.companyName = this.data.bizUserInfo.companyName;
                    this.aboutCompany = this.data.bizUserInfo.aboutCompany;
                    this.mainWorkField = this.data.bizUserInfo.mainWorkField;
                    this.mainWorkArea = this.data.bizUserInfo.mainWorkArea;
                },
                error => {
                    alert(error.text());
                    console.log(error.text());
                    //서버로 부터 응답 실패시 경고창
                }
            )

        // 삭제, 수정을 위한 Auth 값 할당
        this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
        if(this.jwt) { //jwt 값이 null 인지 즉, 로그인을 하지 않는 상태인지 확인
            this.decodedJwt = this.jwt && jwt_decode(this.jwt);//jwt값 decoding
            this.memberIdx = this.decodedJwt.idx; //현재 로그인한 memberIdx 저장
        } else {
            this.memberIdx = null; //로그인 하지 않는 상태일때는 null값
        }
        contentHeaders.set('Authorization', this.jwt);//Header에 jwt값 추가하기
    }
}
