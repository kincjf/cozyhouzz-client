/**
 * Created by insu on 2016-09-02.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http'
import { contentHeaders } from '../../common/headers';
import {MultipartItem} from "../../common/multipart-upload/multipart-item";
import {MultipartUploader} from "../../common/multipart-upload/multipart-uploader";
import { config } from '../../common/config';
import {STATIC_VALUE} from "../../common/config/staticValue";
import * as _ from "lodash";

const template = require('./list.html');

@Component({
    selector: 'roomInfoList',
    template: template
})

/**
 *
 */
export class RoomInfoList {
    jwt: string;
    public data;

    currentPageNumber: number ;
    pageSize: number;
    pageStartIndex: number;
    serverHost: string;

    returnedDatas = [];

    /*
     * Component 역할 :
     * 작업상황 :
     *
     * 차후 개선방안 :
     - UI개선
     */

    constructor(public router: Router, public http: Http) {
        this.currentPageNumber = 1;
        this.pageSize = 10;     // 10개씩 가져온다.
        this.pageStartIndex = 0;

        let URL = [config.serverHost, config.path.roomInfo + "?pageSize=" + this.pageSize + '&pageStartIndex=' + this.pageStartIndex].join('/');

        this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
            .map(res => res.json())//받아온 값을 json형식으로 변경
            .subscribe(
                response => {
                    this.serverHost = config.serverHost;
                    //for of문으로 for–of 루프 구문은 배열의 요소들, 즉 data를 순회하기 위한 구문입니다.
                    for(var roomData of response.roomInfo) {
                        let addressArr = JSON.parse(roomData.address);
                        let key = _.findKey(STATIC_VALUE.PLACE_TYPE, ["number", roomData.roomType]);

                        //returnDatas에 bizUser의 정보를 data의 수만큼 가공해서 저장.
                        this.returnedDatas.push({
                            idx: roomData.idx,
                            memberIdx: roomData.memberIdx,
                            title: roomData.title,
                            roomType : STATIC_VALUE.PLACE_TYPE[key].name,
                            mainPreviewImage: roomData.mainPreviewImage,
                            addressPostcode: addressArr[0],
                            addressAddress: addressArr[1],
                            addressDetail: addressArr[2],
                            deposit: roomData.deposit,
                            monthlyRentFee: roomData.monthlyRentFee,
                            floor: roomData.floor
                        });
                    }
                },
                error => {
                    alert(error.text());
                    console.log(error.text());
                    //서버로 부터 응답 실패시 경고창
                });
    }

    ngAfterContentInit() {    // 로딩때 한번만 뜨는데, life cycle을
        // this.loadDaumMap();
        //this.loadDaumMapScript();
    }

    jumpPage(index, oldIndex) {
        this.pageStartIndex = index;
        let URL = [config.serverHost, config.path.roomInfo + "?pageSize=" + this.pageSize + '&pageStartIndex=' + this.pageStartIndex].join('/');

                    this.http.get(URL, {headers: contentHeaders})
                        .map(res => res.json())//받아온값을 json형식으로 변경
                        .subscribe(
                            response => {
                                this.data = response;
                                if(response.roomInfo.length == 0){ //데이터가 비어있을 때 막아주기
                                    this.pageStartIndex = oldIndex;
                                    alert("더이상 페이지를 넘길수 없습니다.");
                                }
                                else {
                                    this.returnedDatas = []; //데이터를 초기화
                                    this.currentPageNumber = index/this.pageSize + 1;
                                    //for of문으로 for–of 루프 구문은 배열의 요소들, 즉 data를 순회하기 위한 구문입니다.
                                    for(var roomData of response.roomInfo) {
                                        let addressArr = JSON.parse(roomData.address);
                                        let key = _.findKey(STATIC_VALUE.PLACE_TYPE, ["number", roomData.roomType]);

                                        //returnDatas에 bizUser의 정보를 data의 수만큼 받아온다.
                                        this.returnedDatas.push({
                                            idx: roomData.idx,
                                            memberIdx: roomData.memberIdx,
                                            title: roomData.title,
                                            roomType : STATIC_VALUE.PLACE_TYPE[key].name,
                                            mainPreviewImage: roomData.mainPreviewImage,
                                            addressPostcode: addressArr[0],
                                            addressAddress: addressArr[1],
                                            addressDetail: addressArr[2],
                                            deposit: roomData.deposit,
                                            monthlyRentFee: roomData.monthlyRentFee,
                                            floor: roomData.floor
                                        });
                                    }
                                }
                                console.log("Jump page | this.data.RoomInfo.length :" + this.data.RoomInfo.length);
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
        console.log("pageNumberButton" + value);
        const index = (value-1)*(this.pageSize); // 변할페이지
        const oldIndex = this.pageStartIndex;
        //alert("this.pageStartIndex = " + this.pageStartIndex + ", value =" + value);
        this.jumpPage(index, oldIndex);
    }
}
