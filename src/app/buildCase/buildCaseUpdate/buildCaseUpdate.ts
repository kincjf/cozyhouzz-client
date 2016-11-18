import { Component,ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../../common/headers';
import {MultipartItem} from "../../common/multipart-upload/multipart-item";
import {MultipartUploader} from "../../common/multipart-upload/multipart-uploader";
import { config } from '../../common/config';

import { EditorImageUploader } from "../../common/editor-image-uploader";
import {CanDeactivate} from "@angular/router";

declare var jQuery: JQueryStatic;
const template = require('./buildCaseUpdate.html');
const jwt_decode = require('jwt-decode');

@Component({
  selector: 'buildCaseUpdate',
  template: template
})

/*
 Component 역할 : 시공사례 글 수정
 작업상황 :
 -
 차후 개선방안 :
 -
 */
export class BuildCaseUpdate implements CanDeactivate<BuildCaseUpdate> {

  jwt:string;
  public decodedJwt: any;
  public data: any;
  memberType: string;
  public selectedId:number;
  inputBuildTypes = [
    {name: '주거공간'},
    {name: '상업공간'},
    {name: '기타'}
  ];

  title:string;
  buildType:string;
  buildPlace:string;
  buildTotalArea:number;
  mainPreviewImage:string;
  buildTotalPrice:number;
  HTMLText:any;
  VRImages: any;
  memberIdx: number;

  private uploader:MultipartUploader;
  multipartItem:MultipartItem;
  private vrImage: File;
  private previewImage: File;
  private quit:boolean = false;

  constructor(public router: Router, public http: Http, private route: ActivatedRoute, private el:ElementRef) {
    this.jwt = localStorage.getItem('id_token'); //login시 저장된 jwt값 가져오기
    this.decodedJwt = this.jwt && jwt_decode(this.jwt);//jwt값 decoding
    this.memberType = this.decodedJwt.memberType;
//    contentHeaders.append('Authorization', this.jwt);//Header에 jwt값 추가하기
  }

  updateBuildCase(event, inputTitle, inputBuildType, inputBuildPlace, inputBuildPostCode, inputBuildPlaceDetail, inputBuildTotalArea, inputBuildTotalPrice) {
    event.preventDefault();

    var confirmMemberType = "2"; // 2:사업주
    var HTMLText = jQuery(this.el.nativeElement).find('.summernote').summernote('code');// 섬머노트 이미지 업로드는 추후에 변경예정

    var arrBuildPlace = [inputBuildPostCode, inputBuildPlace, inputBuildPlaceDetail];

    //파일 업로더를 위한 설정 값들 선언

    this.uploader.authToken = this.jwt;
    this.multipartItem.headers = contentHeaders;
    this.multipartItem.withCredentials = false;
    this.multipartItem.method = 'PUT';

    if (this.memberType != confirmMemberType) {  //사업주 인지 점검
      alert("시공사례 수정은 사업주만 가능합니다");

      this.quit = true;
      this.router.navigate(['/buildcaselist']);
    } else {
      if (this.multipartItem == null){
        this.multipartItem = new MultipartItem(this.uploader, {
          method: "PUT"
        });
      }

      if (this.multipartItem.formData == null)
        this.multipartItem.formData = new FormData();

      this.multipartItem.formData.append("title", inputTitle );
      this.multipartItem.formData.append("buildType", inputBuildType );
      this.multipartItem.formData.append("buildPlace", JSON.stringify(arrBuildPlace));
      this.multipartItem.formData.append("buildTotalArea", inputBuildTotalArea );
      this.multipartItem.formData.append("buildTotalPrice", inputBuildTotalPrice );
      this.multipartItem.formData.append("HTMLText", HTMLText );
      this.multipartItem.formData.append("previewImage", this.previewImage);

      this.multipartItem.callback = (data) => {
        console.debug("buildCaseUpdate uploadCallback() ==>");
        this.vrImage = null;
        this.previewImage = null;
        if (data){
          console.debug("buildCaseUpdate upload file success.");
          alert("시공사례가 수정 되었습니다.");

          this.quit = true;
          this.router.navigate(['/buildcaselist']); //서버에서 삭제가 성공적으로 완료 되면 시공사례 조회로 이동
        }else{
          console.error("buildCaseUpdate upload file false.");
        }
      }

      this.multipartItem.upload();
    }
  }

  selectVRImage($event): void {
    var inputValue = $event.target;
    if( null == inputValue || null == inputValue.files[0]){
      console.debug("Input file error.");
      return;
    }else {

      for(var i = 0; i < inputValue.files.length; i++){
        this.multipartItem.formData.append("vrImage", inputValue.files[i] );
        console.debug("Input File name: " + inputValue.files[i].name + " type:" + inputValue.files[i].size + " size:" + inputValue.files[i].size);
      }

    }
  }

  selectPreviewImage($event): void {
    var inputValue = $event.target;
    if( null == inputValue || null == inputValue.files[0]){
      console.debug("Input file error.");
      return;
    }else {
      this.previewImage = inputValue.files[0];
      console.debug("Input File name: " + this.previewImage.name + " type:" + this.previewImage.size + " size:" + this.previewImage.size);
    }
  }

  ngAfterViewInit() {
    let that = this;

    // URL 주소 뒤에 오는 param 값을 저장
    this.route.params.forEach((params: Params) => {
      let buildCaseIdx = +params['buildCaseIdx'];
      this.selectedId = buildCaseIdx;
    });
    let URL = [config.serverHost, config.path.buildCase, this.selectedId].join('/');

    this.uploader = new MultipartUploader({url: URL});
    this.multipartItem = new MultipartItem(this.uploader);
    this.multipartItem.formData = new FormData();

    //수정할 시공사례글에 대한 정보를 가져와서 각 항목별 변수에 저장함
    this.http.get(URL, {headers:contentHeaders}) //서버로부터 필요한 값 받아오기
      .map(res => res.json())//받아온 값을 json형식으로 변경
      .subscribe(
        response => {
          this.data = response;

          this.title = this.data.buildCaseInfo.title;
          this.buildType = this.data.buildCaseInfo.buildType;
          this.buildPlace = this.data.buildCaseInfo.buildPlace;
          this.buildTotalArea = this.data.buildCaseInfo.buildTotalArea;
          this.mainPreviewImage = this.data.buildCaseInfo.mainPreviewImage;
          this.buildTotalPrice = this.data.buildCaseInfo.buildTotalPrice;
          this.HTMLText = this.data.buildCaseInfo.HTMLText;
          // jQuery(this.el.nativeElement).find('.summernote').summernote('editor.pasteHTML', this.HTMLText);
          this.VRImages = JSON.parse(this.data.buildCaseInfo.VRImages);
          this.memberIdx = this.data.buildCaseInfo.memberIdx;

        },
        error => {
          console.error(error.text());
          //서버로 부터 응답 실패시 경고창
        }
      );

    // viewChild is set after the view has been initialized
    jQuery(this.el.nativeElement).find('.summernote').summernote({
      height: 300,                 // set editor height
      minHeight: null,             // set minimum height of editor
      maxHeight: null,             // set maximum height of editor
      focus: true,
      callbacks: {
        onImageUpload: function (files, editor) {
          EditorImageUploader.getInstance().upload(files, editor, {authToken: that.jwt});
        },
        onInit: function(instance) {
          instance.editor.summernote('code', that.HTMLText);
        }
      }
    });

  }

  canDeactivate(): Promise<boolean> | boolean {
    if (this.quit) {
      return true;
    } else {
      return confirm("작성을 취소하시겠습니까?");
    }
  }
}

