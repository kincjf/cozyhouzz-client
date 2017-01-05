/**
 * Created by Kimseongbok on 2016-11-06.
 */
import {Component, Pipe, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {contentHeaders} from '../../common/headers';
import {MultipartItem} from "../../common/multipart-upload/multipart-item";
import {MultipartUploader} from "../../common/multipart-upload/multipart-uploader";
import {config} from '../../common/config';
import {STATIC_VALUE} from '../../common/config/staticValue';

import { RecaptchaModule } from 'ng2-recaptcha';

import {EditorImageUploader} from "../../common/editor-image-uploader";
import {CanDeactivate} from "@angular/router";

declare var jQuery: JQueryStatic;
const template = require('./index.html');
const jwt_decode = require('jwt-decode');

@Component({
    selector: 'roomInfoInput',
    template: template
})

/*
 Component 역할 : 시공사례 글 입력
 작업상황 :
 - 다음 우편 API 사용하여 주소 입력 받기(완료)
 차후 개선방안 :
 - 입력 버튼 누르고 나서 VR 파노라마 변환 중 표시 하고 완료 되면 시공사례 목록 조회로 이동 하게 해야함
 */
export class RoomInfoInput implements CanDeactivate<RoomInfoInput> {
    jwt: string;
    public decodedJwt: any;
    public data: any;
    memberType: number;
    confirmMemberType: number = STATIC_VALUE.MEMBER_TYPE.LEASE_MEMBER;      //"임대업자가 접속 했는지 확인 하기위한 값, 3:임대업자

    roomTypes = STATIC_VALUE.PLACE_TYPE;
    existed = STATIC_VALUE.EXISTED;

    private uploader: MultipartUploader;
    multipartItem: MultipartItem;
    private vrImage: File;
    private previewImage: File;
    private quit: boolean = false;

    constructor(public router: Router, public http: Http, private el: ElementRef) {
    }

    /*
     Method 역할 : form 입력된 시공사례 글 정보를 서버에 전달
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    addRoomInfo($event, title, deposit, roomType, monthlyRentFee,
                previewImage, VRImage,
                floor, manageExpense, manageService, areaSize, actualSize, parking, elevator,
        supplyOption, HTMLText, addressPostCode, address, addressDetail, addressExtraInfo, locationInfo, regionCategory, city) {
        var HTMLText = jQuery(this.el.nativeElement).find('.summernote').summernote('code');// 섬머노트 이미지 업로드는 추후에 변경예정
        var HTMLTextLen = jQuery(this.el.nativeElement).find('.summernote').summernote('code').length;
        var arrRoomPlace = [addressPostCode, address, addressDetail, addressExtraInfo]; // 입력받은 우편번호, 주소, 상세주소를 배열에 저장함

        if(addressPostCode>=55000 && addressPostCode<55300){city = 1;} // 전주
        else if(addressPostCode>=54500 && addressPostCode<54800){city=2;} // 익산
        else if(addressPostCode>=54000 && addressPostCode<54300){city=3;} // 군산

        if (HTMLTextLen < 10) { //시공사례 내용이 100자 이상 인지 확인
            alert("방정보 내용을 10자 이상 작성 해야 합니다.");
        } else {
            //파일 업로더를 위한 설정 값들 선언
            this.multipartItem.headers = contentHeaders;
            this.multipartItem.withCredentials = false;
            this.uploader.authToken = this.jwt;

            if (this.multipartItem == null) {
                this.multipartItem = new MultipartItem(this.uploader);
            }

            if (this.multipartItem.formData == null) {
                this.multipartItem.formData = new FormData();
            }

            // clear formData
            for (var key of this.multipartItem.formData.keys()) {
                this.multipartItem.formData.delete(key)
            }

            this.multipartItem.formData.append("title", title);//제목
            this.multipartItem.formData.append("deposit", deposit);//보증금
            this.multipartItem.formData.append("roomType", roomType);//방구조
            this.multipartItem.formData.append("monthlyRentFee", monthlyRentFee);//월세
            this.multipartItem.formData.append("floor", floor);//층/건물층수
            this.multipartItem.formData.append("manageExpense", manageExpense);//관리비
            this.multipartItem.formData.append("manageService", manageService);//관리비 포함목록
            this.multipartItem.formData.append("areaSize", areaSize);//크기
            this.multipartItem.formData.append("actualSize", actualSize);//실재크기
            this.multipartItem.formData.append("parking", parking);//주차공간
            this.multipartItem.formData.append("elevator", elevator);//엘레베이터
            this.multipartItem.formData.append("supplyOption", supplyOption);//엘레베이터
            this.multipartItem.formData.append("HTMLText", HTMLText);//상세설명
            this.multipartItem.formData.append("address", JSON.stringify(arrRoomPlace));//주소
            this.multipartItem.formData.append("locationInfo", locationInfo);//건물정보
            this.multipartItem.formData.append("city", city);

            this.insertFile(previewImage, "previewImage");
            this.insertFile(VRImage, "vrImage");
            this.multipartItem.formData.append("regionCategory", regionCategory);//지역 카테고리 ??????

            this.multipartItem.callback = (data) => {
                if (data) {
                    console.debug("roominfo/input & uploadCallback() upload file success.");
                    alert("방정보가 입력 되었습니다.");

                    this.quit = true;
                    this.router.navigate(['list/room']); //서버에서 삭제가 성공적으로 완료 되면 방정보 조회로 이동
                    // this.router.navigate(['detail/room/:roomListIdx']);
                } else {
                    console.error("roominfo/input & uploadCallback() upload file false.");
                }
            }

            this.multipartItem.upload();
        }
    }

    /*
     Method 역할 : VR 이미지를 input 하면 이미지 전송 formData에 추가
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    insertFile($event, fieldName): boolean {
        var files = $event.files;
        if (null == files || null == files[0]) {
            console.debug("insertFile error - no file");
            return false;
        } else {
            for (var i = 0; i < files.length; i++) {
                this.multipartItem.formData.append(fieldName, files[i]);
                console.debug("Input File name: " + files[i].name + " type:" + files[i].type + " size:" + files[i].size);
            }

            return true;
        }
    }

    ngAfterViewInit() {
        this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
        let thatJwt = this.jwt;

        if (!this.jwt) { //로그인을 했는지 점검
            alert("로그인이 필요합니다.");

            this.quit = true;
            this.router.navigate(['/login']);
            return;
        }

        this.decodedJwt = this.jwt && jwt_decode(this.jwt);//jwt값 decoding
        this.memberType = this.decodedJwt.memberType;

        if (this.memberType != this.confirmMemberType) { //임대업자(3) 인지 점검
            alert("방정보 입력은 임대업자만 가능합니다");

            this.quit = true;
            this.router.navigate(['list/room']);
            return;
        } else {
            let URL = [config.serverHost, config.path.roomInfo].join('/');

            this.uploader = new MultipartUploader({url: URL});
            this.multipartItem = new MultipartItem(this.uploader);
            this.multipartItem.formData = new FormData();

            // 우편번호 팝업창 띄우기
            jQuery(this.el.nativeElement).find("#postcodify_search_button").postcodifyPopUp();

            // viewChild is set after the view has been initialized
            jQuery(this.el.nativeElement).find('.summernote').summernote({
                height: 600,                 // set editor height
                minHeight: null,             // set minimum height of editor
                maxHeight: null,             // set maximum height of editor
                focus: true,
                placeholder: '내용을 10자 이상 입력 해주세요.',
                callbacks: {
                    onImageUpload: function (files, editor) {
                        EditorImageUploader.getInstance().upload(files, editor, {authToken: thatJwt});                    }
                }
            });
        }
    }

    resolvedCaptcha(captchaResponse: string) {
        console.log(`Resolved captcha with response ${captchaResponse}:`);
    }

    canDeactivate(): Promise<boolean> | boolean {
        if (this.quit) {
            return true;
        } else {
            return confirm("작성을 취소하시겠습니까?");
        }
    }
}

