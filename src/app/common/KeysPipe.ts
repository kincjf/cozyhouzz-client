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