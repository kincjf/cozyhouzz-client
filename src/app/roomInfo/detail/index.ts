/**
 * Created by Kimseongbok on 2016-11-06.
 */
import {Component,NgZone,OnInit, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Http} from '@angular/http';
import {contentHeaders} from '../../common/headers';
import {config} from '../../common/config';
import {DomSanitizer} from "@angular/platform-browser";
import * as _ from "lodash";
import {STATIC_VALUE} from '../../common/config/staticValue';
import {DaumMapService} from '../../service/daumMap.service'

const template = require('./index.html');
const jwt_decode = require('jwt-decode');
// const embedpano = require('assets/js/lib/krpano-1.19-pr6-viewer/embedpano.js');

// const moment = require('moment');

@Component({
    selector: 'roomInfoDetail',
    template: template,
    providers: [DaumMapService]
})
export class RoomInfoDetail {

    jwt:string;
    private decodedJwt:any;
    private loginMemberIdx: number;
    public selectedId:number;
    serverHost: string = config.serverHost;

    public data: any;
    returnedDatas = [];

    private memberIdx: number;
    private title: string;
    private roomType: number;
    private address:any;
    private mainPreviewImage:string;

    private deposit: number;
    private monthlyRentFee: number;
    private floor: number;
    private manageExpense: number;
    private manageService: string;
    private areaSize:number;
    private actualSize:number;
    private parking:number;
    private elevator:number;
    private supplyOption:string;
    private availableDate:string;
    private locationInfo:string;
    private VRImages: any;
    private coordinate:any;
    private regionCategory:string;
    private initWriteDate:string;

    // 사업자 회원 정보
    private companyName: string;
    private aboutCompanyShort: string;
    private mainWorkField : string;
    private mainWorkArea : string;
    private companyLogo : string;
    private companyIntroImage : string;
    private contact: string;
    private htmlText;
    private companyIntroImageUrl;
    private addressInfo;
    private addressDetail;


    constructor(public router: Router, public http: Http, private route: ActivatedRoute, private el: ElementRef,
                private _sanitizer: DomSanitizer, private _ngZone:NgZone, private daumMapService: DaumMapService) {
        // this._ngZone.run(() => {
        //     this._increaseProgress(() => {
        //         console.log('ng Zone test oust');
        //     })
        // });
    }

    daumMap(address): void {
        console.log("다음 api 실행 중");
        console.log(address);
        this.daumMapService.loadDaumMap(address);
   }

    ngOnInit(): void {
        // URL 주소 뒤에 오는 param 값을 저장
        this.route.params.forEach((params: Params) => {
            let roomListIdx = +params['roomListIdx'];
            this.selectedId = roomListIdx;
        });

        // let URL = [config.serverHost, config.path.roomInfo, this.selectedId].join('/');
        //
        // //시공사례조회에서 클릭한 시공사례글에 대한 정보를 가져와서 각 항목별 변수에 저장함
        // this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
        //     .map(res => res.json())//받아온 값을 json형식으로 변경
        //     .subscribe(
        //         response => {
        //             this.memberIdx = response.roomInfo.memberIdx;
        //
        //             this.title = response.roomInfo.title;
        //             this.roomType = response.roomInfo.roomType;
        //             this.address = JSON.parse(response.roomInfo.address);        // [우편번호, 일반주소, 상세주소, 참고사항]
        //             this.addressInfo = this.address[1];
        //             this.addressDetail = this.address[2];
        //             this.mainPreviewImage = response.roomInfo.mainPreviewImage;
        //
        //             this.deposit = response.roomInfo.deposit;
        //             this.monthlyRentFee = response.roomInfo.monthlyRentFee;
        //             this.floor = response.roomInfo.floor;
        //             this.manageExpense = response.roomInfo.manageExpense;
        //             this.manageService = response.roomInfo.manageService;
        //             this.areaSize = response.roomInfo.areaSize;
        //             this.actualSize = response.roomInfo.actualSize;
        //             this.parking = response.roomInfo.parking;
        //             this.elevator = response.roomInfo.elevator;
        //             this.supplyOption = response.roomInfo.supplyOption;
        //             this.availableDate = response.roomInfo.availableDate;       // Date
        //
        //             this.htmlText = response.roomInfo.HTMLText;
        //             this.locationInfo = response.roomInfo.locationInfo;
        //             this.VRImages = JSON.parse(response.roomInfo.VRImages);
        //             this.coordinate = JSON.parse(response.roomInfo.coordinate);     // object
        //             this.regionCategory = response.roomInfo.regionCategory;
        //             this.initWriteDate = response.roomInfo.initWriteDate;       // Timestamp
        //
        //             // roomType의 번호에 해당하는 key를 찾은 후, name을 render함
        //             let key = _.findKey(STATIC_VALUE.PLACE_TYPE, ["number", this.roomType]);
        //             this.roomType = STATIC_VALUE.PLACE_TYPE[key].name;
        //
        //             this.onBizUserInfo();
        //
        //             this.daumMap(this.addressInfo);
        //             // 비동기라서 통신이 완료 된 후에 해야지 member변수 값에 할당이 됨.
        //             // 일단 index.html에 짱박아놓음. 나중에 module로 빼자
        //             // proxy 이용
        //             embedpano({swf:"assets/js/lib/krpano-1.19-pr6-viewer/krpano-tour.swf",
        //                 xml: ['/' + this.VRImages.baseDir, this.VRImages.vtourDir, this.VRImages.xmlName].join('/'),
        //                 target:"pano", html5:"auto", mobilescale:1.0, passQueryParameters:true});
        //         },
        //         error => {
        //             console.error(error.text());
        //             //서버로 부터 응답 실패시 경고창
        //         }
        //     );


        // 삭제, 수정을 위한 Auth 값 할당
        this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
        if(this.jwt){ //jwt 값이 null 인지 즉, 로그인을 하지 않는 상태인지 확인
            this.decodedJwt = this.jwt && jwt_decode(this.jwt);//jwt값 decoding
            this.loginMemberIdx = this.decodedJwt.idx; //현재 로그인한 memberIdx 저장
        } else {
            this.loginMemberIdx = null; //로그인 하지 않는 상태일때는 null값
        }
        contentHeaders.set('Authorization', this.jwt);//Header에 jwt값 추가하기
    }

    ngAfterViewInit() {
        let URL = [config.serverHost, config.path.roomInfo, this.selectedId].join('/');

        //시공사례조회에서 클릭한 시공사례글에 대한 정보를 가져와서 각 항목별 변수에 저장함
        this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
            .map(res => res.json())//받아온 값을 json형식으로 변경
            .subscribe(
                response => {
                    this.memberIdx = response.roomInfo.memberIdx;

                    this.title = response.roomInfo.title;
                    this.roomType = response.roomInfo.roomType;
                    this.address = JSON.parse(response.roomInfo.address);        // [우편번호, 일반주소, 상세주소, 참고사항]
                    this.addressInfo = this.address[1];
                    this.addressDetail = this.address[2];
                    this.mainPreviewImage = response.roomInfo.mainPreviewImage;

                    this.deposit = response.roomInfo.deposit;
                    this.monthlyRentFee = response.roomInfo.monthlyRentFee;
                    this.floor = response.roomInfo.floor;
                    this.manageExpense = response.roomInfo.manageExpense;
                    this.manageService = response.roomInfo.manageService;
                    this.areaSize = response.roomInfo.areaSize;
                    this.actualSize = response.roomInfo.actualSize;
                    this.parking = response.roomInfo.parking;
                    this.elevator = response.roomInfo.elevator;
                    this.supplyOption = response.roomInfo.supplyOption;
                    this.availableDate = response.roomInfo.availableDate;       // Date

                    this.htmlText = response.roomInfo.HTMLText;
                    this.locationInfo = response.roomInfo.locationInfo;
                    this.VRImages = JSON.parse(response.roomInfo.VRImages);
                    this.coordinate = JSON.parse(response.roomInfo.coordinate);     // object
                    this.regionCategory = response.roomInfo.regionCategory;
                    this.initWriteDate = response.roomInfo.initWriteDate;       // Timestamp

                    // roomType의 번호에 해당하는 key를 찾은 후, name을 render함
                    let key = _.findKey(STATIC_VALUE.PLACE_TYPE, ["number", this.roomType]);
                    this.roomType = STATIC_VALUE.PLACE_TYPE[key].name;

                    this.onBizUserInfo();

                    this.daumMap(this.addressInfo);
                    // 비동기라서 통신이 완료 된 후에 해야지 member변수 값에 할당이 됨.
                    // 일단 index.html에 짱박아놓음. 나중에 module로 빼자
                    // proxy 이용
                    embedpano({swf:"assets/js/lib/krpano-1.19-pr6-viewer/krpano-tour.swf",
                        xml: ['/' + this.VRImages.baseDir, this.VRImages.vtourDir, this.VRImages.xmlName].join('/'),
                        target:"pano", html5:"auto", mobilescale:1.0, passQueryParameters:true});
                },
                error => {
                    console.error(error.text());
                    //서버로 부터 응답 실패시 경고창
                }
            );

    }

    /*
     Method 역할 : 선택한 시공사례 글을 작성한 시공업체 정보를 가져오기
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    onBizUserInfo() {
        let URL = [config.serverHost, config.path.bizStore, this.memberIdx].join('/');

        this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
            .map(res => res.json())//받아온 값을 json형식으로 변경
            .subscribe(
                response => {
                    this.data = response; // 해당값이 제대로 넘어오는지 확인후 프론트단에 내용추가

                    this.companyName = this.data.bizUserInfo.companyName;
                    this.aboutCompanyShort = this.data.bizUserInfo.aboutCompanyShort;
                    this.mainWorkField = this.data.bizUserInfo.mainWorkField;
                    this.mainWorkArea = this.data.bizUserInfo.mainWorkArea;
                    this.contact = this.data.bizUserInfo.contact;
                    this.companyLogo = this.data.bizUserInfo.companyLogo;     // conmpanyIntroImage
                    this.companyIntroImage = this.data.bizUserInfo.companyIntroImage;     // conmpanyIntroImage

                    this.companyIntroImageUrl = [this.serverHost, this.companyIntroImage].join('/');
                },
                error => {
                    alert(error.text());
                    console.log(error.text());
                    //서버로 부터 응답 실패시 경고창
                }
            )
    }

    /*
     Method 역할 : 선택한 글을 삭제
     작업상황 : 삭제 권한이 있는지 확인 및 삭제 결과 알림창 띄우기 작업(완료)
     차후 개선방안 : 없음
     */
    onDelBuildCase() {
        if(this.loginMemberIdx == this.memberIdx) {
            if (confirm("삭제 하시겠습니까?")) {
                let URL = [config.serverHost, config.path.roomInfo, this.selectedId].join('/');

                this.http.delete(URL, {headers:contentHeaders}) //서버에 삭제할 builcase idx 값 전달
                    .map(res => res.json())//받아온 값을 json형식으로 변경
                    .subscribe(
                        response => {
                            if(response.statusCode == 1){
                                alert("삭제 되었습니다.");
                                this.router.navigate(['list/room']); //서버에서 삭제가 성공적으로 완료 되면 방정보 조회로 이동
                            }
                        },
                        error => {
                            alert("삭제를 실패하였습니다. 관리자에게 문의하세요. - errorCode : " + error.text());
                            console.log(error.text());
                            //서버로 부터 응답 실패시 경고창
                        }
                    )
            }
        } else {
            alert("삭제권한이 없습니다.");
        }

    }

    /*
     Method 역할 : 선택한 시공사례 글을 수정 컴포넌트로 이동
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    onUpdateBuildCase() {
        this.router.navigate(['update/room/'+this.selectedId]); //수정 버튼을 누르면 수정 컴포턴트로 이동
    }

    /*
     Method 역할 : 시공사례 목록 조회로 이동
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    onListBuildCase() {
        this.router.navigate(['list/room']); // 목록버튼을 누르면 목록 조회로 이동
    }

    get HTMLText() {
        return this._sanitizer.bypassSecurityTrustHtml(this.htmlText);
    }

    get routeBizMemberUrl() {
        let routeUrl = ["/bizListDetail", this.memberIdx].join('/');
        return routeUrl;
    }
}