/**
 * Created by Kimseongbok on 2016-11-06.
 */
import {Component, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {contentHeaders} from '../../common/headers';
import {MultipartItem} from "../../common/multipart-upload/multipart-item";
import {MultipartUploader} from "../../common/multipart-upload/multipart-uploader";
import {config} from '../../common/config';

const template = require('./index.html');
// const jwt_decode = require('jwt-decode');

@Component({
    selector: 'roomInfoList',
    template: template
})

export class RoomInfoList {
}