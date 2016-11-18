/**
 * Created by insu on 2016-09-02.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http'
import { contentHeaders } from '../../common/headers';
import { config } from '../../common/config';

const template = require('./bizList.html');

@Component({
    selector: 'bizList',
    template: template
})

/**
 *
 */
export class BizList {
    jwt: string;
    public data;

    currentPageNumber: number ;
    pageSize: number;
    pageStartIndex: number;
    selectedmemberIdx: number;

    serverHost = config.serverHost;

    returnedDatas = [];

    /*
     Component 역할 : 업체 목록 페이지
     작업상황 :
     -
     차후 개선방안 :
     - UI개선
     */

    constructor(public router: Router, public http: Http) {
        this.currentPageNumber = 1;
        this.pageSize = 4;
        this.pageStartIndex = 0;

        let URL = [config.serverHost, config.path.bizStore + "?pageSize=" + this.pageSize + '&pageStartIndex=' + this.pageStartIndex].join('/');

        this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
            .map(res => res.json())//받아온 값을 json형식으로 변경
            .subscribe(
                response => {
                    this.data = response; // 해당값이 제대로 넘어오는지 확인후 프론트단에 내용추가
                    //for of문으로 for–of 루프 구문은 배열의 요소들, 즉 data를 순회하기 위한 구문입니다.
                    for(var bizUser of response.bizUserInfo) {
                        //returnDatas에 bizUser의 정보를 data의 수만큼 받아온다.
                        this.returnedDatas.push({
                            memberIdx: bizUser.memberIdx,
                            companyName: bizUser.companyName,
                            companyLogo: bizUser.companyLogo,
                            aboutCompanyShort: bizUser.aboutCompanyShort
                        });
                    }

                },
                error => {
                    alert(error.text());
                    console.log(error.text());
                    //서버로 부터 응답 실패시 경고창
                }
            )

    }

    jumpPage(index, oldIndex) {
        this.pageStartIndex = index;
        let URL = [config.serverHost, config.path.bizStore + "?pageSize=" + this.pageSize + '&pageStartIndex=' + this.pageStartIndex].join('/');

        this.http.get(URL, {headers: contentHeaders})
            .map(res => res.json())//받아온값을 json형식으로 변경
            .subscribe(
                response => {
                    this.data = response;
                    if(this.data.bizUserInfo.length == 0){ //데이터가 비어있을 때 막아주기
                        this.pageStartIndex = oldIndex;
                        alert("더이상 페이지를 넘길수 없습니다.");
                    }
                    else {
                        this.returnedDatas = []; //데이터를 초기화
                        this.currentPageNumber = index/this.pageSize + 1;
                        //for of문으로 for–of 루프 구문은 배열의 요소들, 즉 data를 순회하기 위한 구문입니다.
                        for(var bizUser of response.bizUserInfo) {
                            //returnDatas에 bizUser의 정보를 data의 수만큼 받아온다.
                            this.returnedDatas.push({
                                companyIntroImage: bizUser.companyIntroImage,
                                memberIdx: bizUser.memberIdx,
                                companyName: bizUser.companyName,
                                aboutCompanyShort: bizUser.aboutCompanyShort
                            });
                        }
                    }

                },
                error=> {
                    alert(error.text());
                    console.log(error.text());
                    //서버로부터 응답 실패시 경고창
                }
            )


    }

    beforePageButton() {//바로 전의 페이지로 이동하는 함수
        const index = this.pageStartIndex - this.pageSize; // 변할페이지
        const oldIndex = this.pageStartIndex; // 현제페이지
        if (index < 0) {
            alert("더이상 페이지를 넘길수 없습니다.");
        }
        else {
            this.jumpPage(index, oldIndex);
        }
    }

    nextPageButton() {//앞의 페이지로 이동하는 함수
        const index = this.pageStartIndex + this.pageSize; // 변할페이지
        const oldIndex = this.pageStartIndex; // 현제페이지
        this.jumpPage(index, oldIndex);
    }

    pageNumberButton(value) {//특정 페이지로 이동하는 함수
        const index = (value-1)*(this.pageSize); // 변할페이지
        const oldIndex = this.pageStartIndex;
        //alert("this.pageStartIndex = " + this.pageStartIndex + ", value =" + value);
        this.jumpPage(index, oldIndex);
    }
}
