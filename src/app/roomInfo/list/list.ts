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
    selectedmemberIdx: number;

    returnedDatas = [];

    /*
     Component 역할 :
     작업상황 :
     -
     차후 개선방안 :
     - UI개선
     */

    constructor(public router: Router, public http: Http) {
        this.currentPageNumber = 1;
        this.pageSize = 4;
        this.pageStartIndex = 0;

        let URL = [config.serverHost, config.path.roomInfo + "?pageSize=" + this.pageSize + '&pageStartIndex=' + this.pageStartIndex].join('/');
        console.log(URL);
        this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
            .map(res => res.json())//받아온 값을 json형식으로 변경
            .subscribe(
                response => {
                    this.data = response; // 해당값이 제대로 넘어오는지 확인후 프론트단에 내용추가
                    //for of문으로 for–of 루프 구문은 배열의 요소들, 즉 data를 순회하기 위한 구문입니다.
                    for(var roomData of response.roomInfo) {
                        //returnDatas에 bizUser의 정보를 data의 수만큼 받아온다.
                        this.returnedDatas.push({
                            idx: roomData.idx,
                            memberIdx: roomData.memberIdx,
                            title: roomData.title,
                            address: roomData.address,
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
                }
            )

    }
}
