import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {SafeHtml} from "@angular/platform-browser";
import {SafeUrl} from "@angular/platform-browser";
import {SafeStyle} from "@angular/platform-browser";
import {SafeResourceUrl} from "@angular/platform-browser";
/**
 * Created by KIMSEONHO on 2016-11-18.
 */
@Pipe({
    name: 'sanitizeHtml'
})
export class SanitizeHtml implements PipeTransform  {

    constructor(private _sanitizer: DomSanitizer){}

    transform(v: string) : SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(v);
    }
}

@Pipe({
    name: 'sanitizeScript'
})
export class SanitizeScript implements PipeTransform  {

    constructor(private _sanitizer: DomSanitizer){}

    transform(v: string) : SafeUrl {
        return this._sanitizer.bypassSecurityTrustUrl(v);
    }
}

@Pipe({
    name: 'sanitizeStyle'
})
export class SanitizeStyle implements PipeTransform  {

    constructor(private _sanitizer: DomSanitizer){}

    transform(v: string) : SafeStyle {
        return this._sanitizer.bypassSecurityTrustStyle(v);
    }
}

@Pipe({
    name: 'sanitizeUrl'
})
export class SanitizeUrl implements PipeTransform  {

    constructor(private _sanitizer: DomSanitizer){}

    transform(v: string) : SafeUrl {
        return this._sanitizer.bypassSecurityTrustUrl(v);
    }
}

@Pipe({
    name: 'sanitizeResourceUrl'
})
export class SanitizeResourceUrl implements PipeTransform  {

    constructor(private _sanitizer: DomSanitizer){}

    transform(v: string) : SafeResourceUrl {
        return this._sanitizer.bypassSecurityTrustResourceUrl(v);
    }
}