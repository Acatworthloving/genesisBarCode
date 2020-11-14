import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import {Observable, throwError, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UserDataService} from '../providers/user-data.service';
import {Storage} from '@ionic/storage';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpsInterceptor implements HttpInterceptor {
    public apiPrefix = environment.apiUrl;

    constructor(
        private router: Router,
        private userData: UserDataService,
        private storage: Storage,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem(this.userData.TOKEN);
        if (!token) {
            this.storage.get(this.userData.TOKEN).then(res => {
                if (res) {
                    token = res;
                }
            });
        }
        if (token) {
            request = request.clone({
                headers: request.headers.append('token', token),
            });
        }
        /**
         * 以免影响调用本地资源
         */
        // if (request.url.split('/')[0] != 'assets' && request.url.split('/')[0] != '.' && request.url.split('/')[2] != 'api.mapbox.com') {
        request = request.clone({
            url: this.apiPrefix + '/api/' + request.url
        });
        // }
        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                setHeaders: {
                    // 'Access-Control-Allow-Origin': '*',
                    // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }
        request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        });

        // request = request.clone({
        //     headers: request.headers.append('appId', '188C59E62A9E4F15BDDD042F4D0AAACE')
        // });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (environment.production) {
                    // this.sentryErrorHandler.handleError(error, request);
                }
                return throwError(error);
            }));
    }
}
