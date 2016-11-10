/**
 * Created by Kimseongbok on 2016-11-06.
 */
import {Component, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, Params, ActivatedRouteSnapshot} from '@angular/router';
import {Http} from '@angular/http';
import {contentHeaders} from '../../common/headers';
import {MultipartItem} from "../../common/multipart-upload/multipart-item";
import {MultipartUploader} from "../../common/multipart-upload/multipart-uploader";
import {config} from '../../common/config';

import {EditorImageUploader} from "../../common/editor-image-uploader";
import * as moment from 'moment';

declare var jQuery: JQueryStatic;
const template = require('./index.html');
const jwt_decode = require('jwt-decode');

@Component({
    selector: 'roomInfoUpdate',
    template: template
})

/*
 Component 역할 : 시공사례 글 입력
 작업상황 :
 - 다음 우편 API 사용하여 주소 입력 받기(완료)
 차후 개선방안 :
 - 입력 버튼 누르고 나서 VR 파노라마 변환 중 표시 하고 완료 되면 시공사례 목록 조회로 이동 하게 해야함
 */
export class RoomInfoUpdate {
    jwt: string;
    public decodedJwt: any;
    public data: any;
    memberType: number;
    confirmMemberType: number = 3;      //"임대업자가 접속 했는지 확인 하기위한 값, 3:임대업자
    idx: number;
    public selectedId: number;

    private uploader: MultipartUploader;
    multipartItem: MultipartItem;
    private vrImage: File;
    private previewImage: File;

    //현재 방정보 변수
    private currentTitle: string;//제목
    private currentDeposit: number;//보증금
    private currentRoomType: number;//방구조
    private currentMonthlyRentFee: number;//월세
    private currentFloor: number;//층/건물층수
    private currentManageExpense: number;//관리비
    currentManageService: string;//관리비 포함목록
    currentAreaSize: number;//크기
    currentActualSize: number;//실재크기
    currentParking: number;//주차공간
    currentElevator: number;//엘레베이터
    currentSupplyOption: string;//제공하는 옵션
    currentHTMLText: string;//상세설명
    currentAddress: string;//주소
    addressArray: any;
    currentLocationInfo: string;//건물정보
    currentVRImages: string;//VR이미지
    currentMainPreviewImage: string;//대표 미리보기 이미지
    currentRegionCategory: string;//지역 태그
    currentAvailableDate: string;//입주가능 날짜

    currentAddressPostCode: string;
    currentAddressAddress: string;
    currentAddressDetail: string;
// //////////////////////////////////////////////////////////////////
//     memberIdx: number;
//     serverHost: string = config.serverHost;
//
//     private deposit: number;
//     title1: string;
//     private monthlyRentFee: number;
//     private floor: number;
//     private manageExpense: number;
//     private manageService: string;
//     private areaSize:number;
//     private actualSize:number;
//     private parking:number;
//     private elevator:number;
//     private supplyOption:string;
//     private parking:number;
//     private availableDate:string;
//     private address: any;
//     private locationInfo:string;
//     private VRImages:string;
//     private mainPreviewImage:string;
//     private coordinate:string;
//     private regionCategory:string;
//     private initWriteDate:string;
//     private createdAt:string;
//     // private updatedAt:string;
//     private HTMLText;
//
//     private companyName: string;
//     private aboutCompany: string;
//     private mainWorkField : string;
//     private mainWorkArea : string;
//     private companyIntroImage : string;
//     private contact: string;
//     private roomType: number;
//     ////////////////////////////////////////////////////////

    constructor(public router: Router, public http: Http, private route: ActivatedRoute, private el: ElementRef) {
    }

    ngOnInit() {
        this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기

        this.route.params.forEach((params:Params) => {
            let roomListIdx = +params['roomListIdx'];
            this.selectedId = roomListIdx;
        });

        if (!this.jwt) { //로그인을 했는지 점검
            alert("로그인이 필요합니다.");
            this.router.navigate(['/login']);
            return;
        }

        this.decodedJwt = this.jwt && jwt_decode(this.jwt);//jwt값 decoding
        this.memberType = this.decodedJwt.memberType;
    }

    /*
     Method 역할 : form 입력된 시공사례 글 정보를 서버에 전달
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    roomInfoChange(event, title, deposit, roomType, monthlyRentFee, floor, manageExpense,manageService, areaSize, actualSize, parking, elevator,
                   supplyOption, HTMLText, addressPostCode, address, addressDetail, extraInfo, locationInfo, VRImages, mainPreviewImage, regionCategory, availableDate) {
        var HTMLText = jQuery(this.el.nativeElement).find('.summernote').summernote('code');// 섬머노트 이미지 업로드는 추후에 변경예정
        var HTMLTextLen = jQuery(this.el.nativeElement).find('.summernote').summernote('code').length;
        var arrRoomPlace = [addressPostCode, address, addressDetail, extraInfo]; // 입력받은 우편번호, 주소, 상세주소를 배열에 저장함

        if (HTMLTextLen < 100) { //시공사례 내용이 100자 이상 인지 확인
            alert("방정보 내용을 100자 이상 작성 해야 합니다.");
        } else {
            //파일 업로더를 위한 설정 값들 선언
            this.multipartItem.headers = contentHeaders;
            this.multipartItem.withCredentials = false;
            this.uploader.authToken = this.jwt;

            if (this.multipartItem == null) {
                this.multipartItem = new MultipartItem(this.uploader);
            }
            if (this.multipartItem.formData == null)
                this.multipartItem.formData = new FormData();

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
            this.multipartItem.formData.append("supplyOption", supplyOption);//관리비 포함목록
            this.multipartItem.formData.append("HTMLText", HTMLText);//상세설명
            this.multipartItem.formData.append("address", JSON.stringify(arrRoomPlace));//주소
            this.multipartItem.formData.append("locationInfo", locationInfo);//건물정보
            this.multipartItem.formData.append("regionCategory", regionCategory);//지역 태그
            this.multipartItem.formData.append("availableDate", availableDate);//입주가능 날짜

            this.multipartItem.upload();


            this.multipartItem.callback = (data) => {
                console.debug("home.ts & uploadCallback() ==>");
                this.vrImage = null;
                this.previewImage = null;
                if (data) {
                    console.debug("roominfo/input & uploadCallback() upload file success.");
                    alert("방정보가 입력 되었습니다.");
                    this.router.navigate(['/buildcaselist']); //서버에서 삭제가 성공적으로 완료 되면 방정보 조회로 이동
                    // this.router.navigate(['detail/room/:roomListIdx']);
                } else {
                    console.error("roominfo/input & uploadCallback() upload file false.");
                }
            }
        }
    }

    /*
     Method 역할 : VR 이미지를 input 하면 이미지 전송 formData에 추가
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    selectVRImage($event): void {
        var inputValue = $event.target;
        if (null == inputValue || null == inputValue.files[0]) {
            console.debug("Input file error.");
            return;
        } else {

            for (var i = 0; i < inputValue.files.length; i++) {
                this.multipartItem.formData.append("vrImage", inputValue.files[i]);
                console.debug("Input File name: " + inputValue.files[i].name + " type:" + inputValue.files[i].size + " size:" + inputValue.files[i].size);
            }

        }
    }

    /*
     Method 역할 : 대표 이미지를 input 하면 이미지 전송 formData에 추가
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    selectPreviewImage($event): void {
        var inputValue = $event.target;
        if (null == inputValue || null == inputValue.files[0]) {
            console.debug("Input file error.");
            return;
        } else {
            this.previewImage = inputValue.files[0];
            console.debug("Input File name: " + this.previewImage.name + " type:" + this.previewImage.size + " size:" + this.previewImage.size);
        }
    }

    ngAfterViewInit() {
        let that = this;
        let thatJwt = this.jwt;

        if (this.memberType != this.confirmMemberType) { //임대업자(3) 인지 점검
            alert("방정보 입력은 임대업자만 가능합니다");
            this.router.navigate(['list/room']);
            return;
        } else {
            let URL = [config.serverHost, config.path.roomInfo, this.selectedId].join('/');

            this.uploader = new MultipartUploader({url: URL});
            this.multipartItem = new MultipartItem(this.uploader);
            this.multipartItem.formData = new FormData();

            this.http.get(URL, {headers: contentHeaders}) //서버로부터 필요한 값 받아오기
                .map(res => res.json())//받아온 값을 json형식으로 변경
                .subscribe(
                    response => {
                        this.data = response; // 해당값이 제대로 넘어오는지 확인후 프론트단에 내용추가
                        console.log(this.data);
                        this.idx = this.data.roomInfo.idx;

                        //현재 수정할 정보를 불러오기
                        this.currentTitle = this.data.roomInfo.title;
                        this.currentDeposit = this.data.roomInfo.deposit;
                        this.currentRoomType = this.data.roomInfo.roomType;
                        this.currentMonthlyRentFee = this.data.roomInfo.monthlyRentFee;
                        this.currentFloor = this.data.roomInfo.floor;
                        this.currentManageExpense = this.data.roomInfo.manageExpense;
                        this.currentManageService = this.data.roomInfo.manageService;
                        this.currentAreaSize = this.data.roomInfo.areaSize;
                        this.currentActualSize = this.data.roomInfo.actualSize;
                        this.currentParking = this.data.roomInfo.parking;
                        this.currentElevator = this.data.roomInfo.elevator;
                        this.currentSupplyOption = this.data.roomInfo.supplyOption;
                        this.currentHTMLText = this.data.roomInfo.HTMLText;
                        this.currentAddress = JSON.parse(this.data.roomInfo.address);

                        this.currentAddressPostCode = this.currentAddress[0];
                        this.currentAddressAddress = this.currentAddress[1];
                        this.currentAddressDetail = this.currentAddress[2];

                        this.currentLocationInfo = this.data.roomInfo.locationInfo;
                        this.currentVRImages = this.data.roomInfo.VRImages;
                        this.currentMainPreviewImage = this.data.roomInfo.mainPreviewImage;
                        this.currentRegionCategory = this.data.roomInfo.regionCategory;
                        this.currentAvailableDate = moment(this.data.roomInfo.availableDate).format('YYYY-MM-DD');

                        // 우편번호 팝업창 띄우기
                        jQuery(this.el.nativeElement).find("#postcodify_search_button").postcodifyPopUp();

                        // viewChild is set after the view has been initialized
                        jQuery(this.el.nativeElement).find('.summernote').summernote({
                            height: 600,                 // set editor height
                            minHeight: null,             // set minimum height of editor
                            maxHeight: null,             // set maximum height of editor
                            focus: true,
                            placeholder: '내용을 100자 이상 입력 해주세요.',
                            callbacks: {
                                onImageUpload: function (files, editor) {
                                    EditorImageUploader.getInstance().upload(files, editor, {authToken: thatJwt});
                                },
                                onInit: function(instance) {
                                    instance.editor.summernote('code', that.currentHTMLText);
                                }
                            }
                        });
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

