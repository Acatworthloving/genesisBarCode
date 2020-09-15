/*
 * @Author: Jian
 * @Copyright: jianhui.huang@dreamover-studio.com
 * @Description: 
 * @LastEditors: Jian
 * @Date: 2020-02-27 14:06:26
 * @LastEditTime: 2020-03-06 12:09:19
 */
import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs';
import { Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavController} from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class PageRouterService {
    public history = [];
    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public navController: NavController,
    ) {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(({urlAfterRedirects}: NavigationEnd) => {
            this.history = [...this.history, urlAfterRedirects];
        });
    }


    getPageParams() {
        // const tempSub = new Subject<any>();
        // this.activatedRoute.queryParams.subscribe(params => {
        //     console.log('11111');
        //     if (this.router.getCurrentNavigation().extras.state) {
        //         const state = this.router.getCurrentNavigation().extras.state;
        //         console.log('22222', state.data);
        //         tempSub.next(state.data);
        //     }
        //     tempSub.next('444');
        // });
        // return tempSub.asObservable();
        return new Promise((resolve, reject) => {
            this.activatedRoute.queryParams.subscribe(params => {
                if (this.router.getCurrentNavigation().extras.state) {
                    const state = this.router.getCurrentNavigation().extras.state;
                    resolve(state.data);
                } else {
                    reject(false);
                }
            });
        });
    }

    toPage(page: string, id?: string, params?: any) {
        const navigationExtras: NavigationExtras = {
            state: {
                data: params
            }
        };
        if (id) {
            this.router.navigate([page, id], navigationExtras);
        } else {
            this.router.navigate([page], navigationExtras);
        }
    }


    goBack() {
        const previousUrl = this.getPreviousUrl();
        if (previousUrl) {
            this.toPage(previousUrl);
        } else {
            this.navController.back();
        }
    }

    public getPreviousUrl(): string {
        return this.history[this.history.length - 2] || '/tabs/timeEntry';
    }
}
