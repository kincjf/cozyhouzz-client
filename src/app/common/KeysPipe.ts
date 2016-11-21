import {Pipe, PipeTransform} from "@angular/core";
/**
 * Created by KIMSEONHO on 2016-11-18.
 */
@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
    transform(value, args:string[]) : any {
        let keys = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}

@Pipe({ name: 'values',  pure: false })
export class ValuesPipe implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        return Object.keys(value).map(key => value[key]);
    }
}