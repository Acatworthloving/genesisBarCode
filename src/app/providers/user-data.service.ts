import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {CacheService} from 'ionic-cache';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    HAS_LOGGED_IN: any = 'hasLoggedIn';
    PROFILE: any = 'profile';
    TOKEN: any = 'genesisNewsToken';
    user: any;
    LANGUAGE: any = 'genesisNewsLanguage';
    switchRole = new BehaviorSubject(undefined);
    publishProfile = new BehaviorSubject(undefined);
    systemData = new BehaviorSubject(undefined);
    branchDistrict = new BehaviorSubject(undefined);

    constructor(
        private storage: Storage,
        private router: Router,
        private navCtrl: NavController,
        // public timeService: TimeService,
        // private dataService: DataService,
    ) {
    }

    isLoggedIn(): Promise<boolean> {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value === true;
        });
    }

    login(token: string) {
        const tempSub = new Subject<any>();
        localStorage.setItem(this.HAS_LOGGED_IN, JSON.stringify(true));
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setToken(token).subscribe(() => {
            tempSub.next();
        });
        // this.getProfile(token);
        return tempSub.asObservable();
    }

    logout() {
        const account = localStorage.getItem('lastUserName') || '';
        localStorage.clear();
        localStorage.setItem('lastUserName', account);
        // this.router.navigateByUrl('/login');
        this.navCtrl.navigateRoot('/login');
    }

    getLanguage() {
        const tempSub = new Subject<any>();
        this.storage.get(this.LANGUAGE).then((language) => {
            tempSub.next(JSON.parse(language));
        });
        return tempSub.asObservable();
    }

    setLanguage(language) {
        const tempSub = new Subject<any>();
        this.storage.set(this.LANGUAGE, JSON.stringify(language)).then(() => {
            tempSub.next();
        });
        return tempSub.asObservable();
    }

    setToken(token: string) {
        localStorage.setItem(this.TOKEN, token);
        const tempSub = new Subject<any>();
        this.storage.set(this.TOKEN, token).then(() => {
            tempSub.next();
        });
        return tempSub.asObservable();
    }

    getToken(): Observable<any> {
        const tempSub = new Subject<any>();
        this.storage.get(this.TOKEN).then((token) => {
            tempSub.next(token);
        });
        return tempSub.asObservable();
    }

    setProfile(profile) {
        const tempSub = new Subject<any>();
        if (profile) {
            this.user = profile;
            this.publishProfile.next(this.user);
            localStorage.setItem(this.PROFILE, JSON.stringify(profile));
            this.storage.set(this.PROFILE, JSON.stringify(profile)).then(() => {
                tempSub.next();
            });
        } else {
            tempSub.next(false);
        }
        return tempSub.asObservable();
    }


    getProfile(token?: string) {
        // const tempSub = new BehaviorSubject<boolean>(false);
        const tempSub = new Subject<any>();
        if (this.user) {
            tempSub.next(this.user);
        } else {
            this.storage.get(this.PROFILE).then(profile => {
                if (profile) {
                    this.user = JSON.parse(profile);
                    tempSub.next(JSON.parse(profile));
                } else {
                    // this.dataService.getData('api/player/getProfile').subscribe(resp => {
                    //     if (resp.code === 200) {
                    //         this.user = resp.data;
                    //         this.storage.set(this.PROFILE, JSON.stringify(resp.data));
                    //         localStorage.setItem(this.PROFILE, JSON.stringify(resp.data));
                    //         tempSub.next(resp.data);
                    //     }
                    // });
                    tempSub.next(false);
                }
            });
        }
        return tempSub.asObservable();
    }


    getSwitchRole() {
        let role = 'employee';
        this.storage.get('switchRole').then(resp => {
            if (resp) {
                role = resp;
            }
        });
        return role;
    }

    /**
     * @description: 获取对应module的filter 缓存条件
     * @Date: 2020-04-13 11:25:48
     * @return:
     */
    getFilterData(role: string, module: string, user: any) {
        const tempSub = new Subject<any>();
        let filterData: any = {};
        if (user && user.employee_id) {
            const ID = user.employee_id;
            const key = ID + '-' + role + '-' + module + '-filter';
            this.storage.get(key).then(resp => {
                if (resp) {
                    resp = JSON.parse(resp);
                    filterData = resp;
                }
                tempSub.next(filterData);
            }, error => {
                console.log('error', error);
            });
        } else {
            tempSub.next(filterData);
        }
        return tempSub.asObservable();
    }
}
