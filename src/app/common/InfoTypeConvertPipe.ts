import {Pipe, PipeTransform} from "@angular/core";
import * as _ from "lodash";
import {STATIC_VALUE} from './config/staticValue';

/**
 * Created by KIMSEONHO on 2016-11-18.
 */
@Pipe({name: 'InfoTypeConvert'})
export class InfoTypeConvertPipe implements PipeTransform {
    transform(value, args:string[]) : any {
        let key = _.findKey(STATIC_VALUE.PLACE_TYPE, function(o: any) { return o.number == value; });

        return STATIC_VALUE.PLACE_TYPE[key].name;
    }
}