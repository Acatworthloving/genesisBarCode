import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpRequest, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {PresentService} from '../providers/present.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(
        private storage: Storage,
        public http: HttpClient,
        public presentService: PresentService,
    ) {
    }

    getData(api: string, postParams?: any) {
        return this.http.get(api, {
            params: postParams
        }).pipe(
            map((data: any) => {
                if (data.ErrCode == -100) {
                    this.presentService.presentToast('登录信息过期，请重新登入', 'warning');
                    return false;
                } else if (data.ErrCode == 0) {
                    return data;
                } else {
                    this.presentService.presentToast(data.ErrMsg, 'warning');
                    return false;
                }
            })
        );
    }

    postData(api: string, postParams?: any) {
        return this.http.post(api, postParams).pipe(
            map((data: any) => {
                if (data.ErrCode == -100) {
                    this.presentService.presentToast('登录信息过期，请重新登入', 'warning');
                    return false;
                } else if (data.ErrCode == 0) {
                    return data;
                } else {
                    this.presentService.presentToast(data.ErrMsg, 'warning');
                    return false;
                }
            })
        );
    }

    putData(api: string, postParams?: any) {
        return this.http.put(api, postParams).pipe(
            map((data: any) => {
                if (data.ErrCode == -100) {
                    this.presentService.presentToast('登录信息过期，请重新登入', 'warning');
                    return false;
                } else if (data.ErrCode == 0) {
                    return data;
                } else {
                    this.presentService.presentToast(data.ErrMsg, 'warning');
                    return false;
                }
            })
        );
    }

    deleteData(api: string, postParams?: any) {
        return this.http.delete(api, postParams).pipe(
            map((data: any) => {
                if (data.ErrCode == -100) {
                    this.presentService.presentToast('登录信息过期，请重新登入', 'warning');
                    return false;
                } else if (data.ErrCode == 0) {
                    return data;
                } else {
                    this.presentService.presentToast(data.ErrMsg, 'warning');
                    return false;
                }
            })
        );
        // let req = new HttpRequest('DELETE', api, postParams, {
        //     // reportProgress: true,
        // });
        // const token = localStorage.getItem('t101Authorization');
        // req = req.clone({
        //     setHeaders: {
        //         Authorization: token
        //     }
        // });
        // return this.http.request(req).pipe(
        //     map((response: any) => {
        //         return response;
        //     })
        // );
    }
}
