/**
 * Created by KIMSEONHO on 2016-11-18.
 */
interface FormData {
    append(name: any, value: any, blobName?: string): void;
    keys(): any[];
    delete(name: any): void;
}

// declare var FormData: {
//     prototype: FormData;
//     new (form?: HTMLFormElement): FormData;
// }
