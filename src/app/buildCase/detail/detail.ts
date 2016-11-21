import {Component, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Http} from '@angular/http';
import {contentHeaders} from '../../common/headers';
import {config} from '../../common/config';
import * as moment from 'moment';
import {OnInit} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {DomSanitizer} from "@angular/platform-browser";
import {SafeUrl} from "@angular/platform-browser";
import {SafeResourceUrl} from "@angular/platform-browser";
import {STATIC_VALUE} from "../../common/config/staticValue";
import * as _ from "lodash";

declare var jQuery: JQueryStatic;
const template = require('./detail.html');
const jwt_decode = require('jwt-decode');
const embedpano = require('assets/js/lib/krpano-1.19-pr6-viewer/embedpano.js');

@Component({
    selector: 'buildCaseDetail',
    template: template
})

/*
 Component 역할 : 선택한 시공사례 글 상세보기
 작업상황 :
 - 글에 대한 권한이 있는 사람에게만 수정,삭제 버튼이 보이고 나머지는 목록 버튼이 보이게 하기(완료)
 차후 개선방안 : owl-carousel의 문제 때문에 image가 보이지 않음 : ngAfterViewInit에서 플러그인으로 로딩해야함.
 */
export class BuildCaseDetail implements OnInit {
    jwt: string;
    private decodedJwt: any;
    private loginMemberIdx: number;
    public selectedId: number;

    public data: any;
    title: string;
    buildType: string;
    buildPlace: any;
    buildTotalArea: number;
    mainPreviewImage: string;
    buildTotalPrice: number;
    private htmlText: any;
    VRImages: any;
    coordinate: any;
    regionCategory: any;
    initWriteDate: string;

    memberIdx: number;
    companyName: string;
    ownerName: string;
    mainWorkField: string;
    mainWorkArea: string;
    workPlace: string;
    contact: string;
    companyIntroImage: string;
    serverHost: string = config.serverHost;
    companyIntroImageUrl;

    buildTypes = STATIC_VALUE.PLACE_TYPE;

    constructor(public router: Router, public http: Http, private route: ActivatedRoute, private el: ElementRef,
                private _sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        // URL 주소 뒤에 오는 param 값을 저장
        this.route.params.forEach((params: Params) => {
            let buildCaseIdx = +params['buildCaseIdx'];
            this.selectedId = buildCaseIdx;
        });

        let URL = [config.serverHost, config.path.buildCase, this.selectedId].join('/');

        // 통신속도가 로딩 속도보다 느리고, 연결된 데이터 때문에, observable가 아닌 promise를 이용하여 sync로 처리함.
        this.getBuilcCaseInfo(URL).then(() => {
            let URL = [config.serverHost, config.path.bizStore, this.memberIdx].join('/');
            return this.getBizUserInfo(URL);
        }).then(() => {


            this.makePano();
        }).catch(err => {
            console.error(err.text());
        });

        // 삭제, 수정을 위한 Auth 값 할당
        this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
        if (this.jwt) { //jwt 값이 null 인지 즉, 로그인을 하지 않는 상태인지 확인
            this.decodedJwt = this.jwt && jwt_decode(this.jwt);//jwt값 decoding
            this.loginMemberIdx = this.decodedJwt.idx; //현재 로그인한 memberIdx 저장
        } else {
            this.loginMemberIdx = null; //로그인 하지 않는 상태일때는 null값
        }
        contentHeaders.set('Authorization', this.jwt);//Header에 jwt값 추가하기
    }

    buildTypeFuntion(buildType) {
        var type = this.buildTypes;
        if(type.APARTMENT.number == buildType){
            this.buildType = type.APARTMENT.name;
        }
        else if(type.VILLA.number == buildType){
            this.buildType = type.VILLA.name;
        }
        else if(type.DETACHED_HOUSE.number == buildType){
            this.buildType = type.DETACHED_HOUSE.name;
        }
        else if(type.ONE_ROOM.number == buildType){
            this.buildType = type.ONE_ROOM.name;
        }
        else if(type.TWO_ROOM.number == buildType){
            this.buildType = type.TWO_ROOM.name;
        }
        else if(type.THREE_ROOM.number == buildType){
            this.buildType = type.THREE_ROOM.name;
        }
        else if(type.OFFICETEL.number == buildType){
            this.buildType = type.OFFICETEL.name;
        }
        else if(type.OFFICE.number == buildType){
            this.buildType = type.OFFICE.name;
        }
        else if(type.SHOPPING.number == buildType){
            this.buildType = type.SHOPPING.name;
        }
        else if(type.CAFE_RESTAURANT.number == buildType){
            this.buildType = type.CAFE_RESTAURANT.name;
        }
        else if(type.ACADEMY.number == buildType) {
            this.buildType = type.ACADEMY.name;
        }
        else if(type.CAFE_RESTAURANT.number == buildType){
            this.buildType = type.HOSPITAL.name;
        }
    }

    getBuilcCaseInfo(URL: string) {
        return this.http.get(URL, {headers: contentHeaders}) //서버로부터 필요한 값 받아오기
            .map(res => res.json())//받아온 값을 json형식으로 변경
            .toPromise()
            .then(
                response => {
                    this.memberIdx = response.buildCaseInfo.memberIdx;
                    this.title = response.buildCaseInfo.title;
                    this.buildType = response.buildCaseInfo.buildType;
                    // this.buildTypeFuntion(this.buildType);
                    this.buildPlace = JSON.parse(response.buildCaseInfo.buildPlace);
                    this.buildPlace = this.buildPlace[1] + '' + this.buildPlace[2];
                    this.buildTotalArea = response.buildCaseInfo.buildTotalArea;
                    this.mainPreviewImage = response.buildCaseInfo.mainPreviewImage;
                    this.buildTotalPrice = response.buildCaseInfo.buildTotalPrice;
                    this.htmlText = response.buildCaseInfo.HTMLText;
                    this.VRImages = JSON.parse(response.buildCaseInfo.VRImages);
                    this.coordinate = response.buildCaseInfo.coordinate;    // 나중에 좌표를 받아서 Daum Map에 뿌려준다
                    // this.coordinate = JSON.parse(response.buildCaseInfo.coordinate);
                    this.regionCategory = response.buildCaseInfo.regionCategory;
                    this.initWriteDate = moment(response.buildCaseInfo.initWriteDate).format('YYYY/MM/DD');

                    let key = _.findKey(STATIC_VALUE.PLACE_TYPE, ["number", this.buildType]);
                    this.buildType = STATIC_VALUE.PLACE_TYPE[key].name;
                }
            );

    }

    /*
     Method 역할 : 선택한 시공사례 글을 작성한 시공업체 정보를 가져오기
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    getBizUserInfo(URL: string) {

        return this.http.get(URL, {headers: contentHeaders}) //서버로부터 필요한 값 받아오기
            .map(res => res.json())//받아온 값을 json형식으로 변경
            .toPromise()
            .then(
                response => {
                    this.data = response; // 해당값이 제대로 넘어오는지 확인후 프론트단에 내용추가

                    this.companyName = this.data.bizUserInfo.companyName;
                    this.ownerName = this.data.bizUserInfo.ownerName;
                    this.mainWorkField = this.data.bizUserInfo.mainWorkField;
                    this.mainWorkArea = this.data.bizUserInfo.mainWorkArea;
                    this.workPlace = JSON.parse(this.data.bizUserInfo.workPlace);
                    this.workPlace = this.workPlace[1] + '' + this.workPlace[2];
                    this.contact = this.data.bizUserInfo.contact;
                    this.companyIntroImage = this.data.bizUserInfo.companyIntroImage;     // conmpanyIntroImage

                    // dom에 뿌려지는 데이터는 아래와 같이 처리를 해주자
                    // sanitizing HTML stripped some content (see http://g.co/ng/security#xss) 수정을 위해서 property에 직접 할당을 해야함.
                    // (pipe로는 동작하 않는다.)
                    this.companyIntroImageUrl = [this.serverHost, this.companyIntroImage].join('/');
                }
            )
    }

    /*
     Method 역할 : 선택한 시공사례 글을 삭제
     작업상황 : 삭제 권한이 있는지 확인 및 삭제 결과 알림창 띄우기 작업(완료)
     차후 개선방안 : 없음
     */
    onDelBuildCase() {
        if (this.loginMemberIdx == this.memberIdx) {
            if (confirm("삭제 하시겠습니까?")) {
                let URL = [config.serverHost, config.path.buildCase, this.selectedId].join('/');

                this.http.delete(URL, {headers: contentHeaders}) //서버에 삭제할 builcase idx 값 전달
                    .map(res => res.json())//받아온 값을 json형식으로 변경
                    .subscribe(
                        response => {
                            if (response.statusCode == 1) {
                                alert("삭제 되었습니다.");
                                this.router.navigate(['/buildcaselist']); //서버에서 삭제가 성공적으로 완료 되면 시공사례 조회로 이동
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
        this.router.navigate(['/buildcaseupdate/' + this.selectedId]); //수정 버튼을 누르면 수정 컴포턴트로 이동
    }

    /*
     Method 역할 : 시공사례 목록 조회로 이동
     작업상황 : 없음
     차후 개선방안 : 없음
     */
    onListBuildCase() {
        this.router.navigate(['/buildcaselist']); // 목록버튼을 누르면 시공사례 목록 조회로 이동
    }

    makePano() {
        // proxy 이용
        return embedpano({
            swf: "assets/js/lib/krpano-1.19-pr6-viewer/krpano-tour.swf",
            xml: ['/' + this.VRImages.baseDir, this.VRImages.vtourDir, this.VRImages.xmlName].join('/'),
            target: "pano", html5: "auto", mobilescale: 1.0, passQueryParameters: true
        });
    }

    ngAfterViewInit() {
    }

    get routeBizMemberUrl() {
        let routeUrl = ["/bizListDetail", this.memberIdx].join('/');
        return routeUrl;
    }

    get HTMLText() {
        return this._sanitizer.bypassSecurityTrustHtml(this.htmlText);
    }


}
