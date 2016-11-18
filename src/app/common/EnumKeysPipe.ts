/**
 * Created by KIMSEONHO on 2016-11-18.
 */
import {Pipe, PipeTransform, Component} from "@angular/core";

@Pipe({name: 'enumKeys'})
export class EnumKeysPipe implements PipeTransform {
    transform(value, args:string[]) : any {
        let keys = [];
        for (var enumMember in value) {
            var isValueProperty = parseInt(enumMember, 10) >= 0;
            if (isValueProperty) {
                keys.push({key: enumMember, value: value[enumMember]});
                // Uncomment if you want log
                // console.log("enum member: ", value[enumMember]);
            }
        }
        return keys;
    }
}