import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { contentHeaders } from '../../common/headers';
import { config } from '../../common/config';

const template = require('./buildCaseList.html');

@Component({
  selector: 'buildCaseList',
  template: template
})

/*
 Component 역할 : 시공사례 글 목록 조회 하기
 작업상황 :
 - 보기 좋게 Grid 배치 및 글자 배치 하기
 차후 개선방안 :
 - 글 10개 단위로 무한 스크롤 적용하기
 */
export class BuildCaseList {
  pageSize: number;
  pageStartIndex: number;
  returnedDatas = [];
  selectedBuildCaseIdx: number;
  serverHost: string;
  currentPageNumber: number;

  constructor(public router: Router, public http: Http) {
  }

  ngAfterViewInit() {
    this.currentPageNumber=1;
    this.pageSize= 10;
    this.pageStartIndex=0;

    let URL = [config.serverHost, config.path.buildCase + '?pageSize=' + this.pageSize +'&pageStartIndex=' + this.pageStartIndex].join('/');

    //현재 DB에 저장된 시공사례 글을 pageSize와 pageStartIndex를 이용하면 필요 갯수 만큼 가져옴
    this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
      .map(res => res.json())//받아온 값을 json형식으로 변경
      .subscribe(
        response => {//for of문으로 for–of 루프 구문은 배열의 요소들, 즉 data를 순회하기 위한 구문입니다.
          this.serverHost = config.serverHost;

          //for of문으로 for–of 루프 구문은 배열의 요소들, 즉 data를 순회하기 위한 구문입니다.
            for (var buildCaseData of response.buildCaseInfo) {
              //returnDatas에 bizUser의 정보를 data의 수만큼 받아온다.

              let buildPlaceArr = JSON.parse(buildCaseData.buildPlace);

              this.returnedDatas.push({
                selectedBuildCaseIdx: buildCaseData.idx,
                title: buildCaseData.title,
                mainPreviewImage: buildCaseData.mainPreviewImage,
                HTMLText: buildCaseData.HTMLText,
                buildPlace: buildPlaceArr[1],
                buildPlaceDetail: buildPlaceArr[2],
            });
          }
        },
        error => {
          alert(error.text());
          console.log(error.text());
          //서버로부터 응답 실패시 경고창
        }
      );
  }

  jumpPage(index, oldIndex) {
    this.pageStartIndex = index;
    let URL = [config.serverHost, config.path.buildCase + "?pageSize=" + this.pageSize + '&pageStartIndex=' + this.pageStartIndex].join('/');

    this.http.get(URL, {headers: contentHeaders})
        .map(res => res.json())//받아온값을 json형식으로 변경
        .subscribe(
            response => {

              if(response.buildCaseInfo.length == 0){ //데이터가 비어있을 때 막아주기
                this.pageStartIndex = oldIndex;
                alert("더이상 페이지를 넘길수 없습니다.");
              }
              else {
                this.returnedDatas = []; //데이터를 초기화
                this.currentPageNumber = index/this.pageSize+1;

                //for of문으로 for–of 루프 구문은 배열의 요소들, 즉 data를 순회하기 위한 구문입니다.
                for (var buildCaseData of response.buildCaseInfo) {
                  //returnDatas에 bizUser의 정보를 data의 수만큼 받아온다.
                  let buildPlaceArr = JSON.parse(buildCaseData.buildPlace);

                  this.returnedDatas.push({
                    selectedBuildCaseIdx: buildCaseData.idx,
                    title: buildCaseData.title,
                    mainPreviewImage: buildCaseData.mainPreviewImage,
                    HTMLText: buildCaseData.HTMLText,
                    buildPlace: buildPlaceArr[1],
                    buildPlaceDetail: buildPlaceArr[2],
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
    // this.currentPageNumber = oldIndex/this.pageSize+1;
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
    // this.currentPageNumber = oldIndex/this.pageSize+1;
    this.jumpPage(index, oldIndex);
  }

  pageNumberButton(value) {//특정 페이지로 이동하는 함수
    const index = (value-1)*(this.pageSize); // 변할페이지
    const oldIndex = this.pageStartIndex;
    // this.currentPageNumber = oldIndex/this.pageSize+1;
    //alert("this.pageStartIndex = " + this.pageStartIndex + ", value =" + value);
    this.jumpPage(index, oldIndex);
  }
}
