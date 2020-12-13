import {Component} from '@angular/core';

import {Platform, NavController, AlertController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Router} from '@angular/router';
import {PresentService} from './providers/present.service';
import {PublicService} from './providers/public.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private router: Router,
        public presentService: PresentService,
        public publicService: PublicService,
        public alertController: AlertController,
        private navCtrl: NavController,
    ) {
        this.initializeApp();
        this.platform.backButton.subscribe(async () => {
            if (this.router.url !== '/home' && this.router.url !== '/' && this.router.url !== '/login') {
                const alert = await this.alertController.create({
                    cssClass: 'my-custom-class',
                    header: '确定退出当前页？',
                    buttons: [
                        {
                            text: '取消',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => {
                                // console.log('1', this.router.url);
                            }
                        }, {
                            text: '确定',
                            handler: (resp) => {
                                this.presentService.dismissToast();
                                this.navCtrl.navigateRoot('home');
                            }
                        }
                    ]
                });
                await alert.present();
            }
        });
    }

    async initializeApp(): Promise<void> {
        await this.platform.ready();
        this.platform.backButton.subscribeWithPriority(1, () => {
            // 在整个应用程序上禁用硬件后退按钮
        });

    }

    // initializeApp() {
    //     // this.platform.ready().then(() => {
    //     //     this.statusBar.styleDefault();
    //     //     this.initializeSwitchRole();
    //     // });
    // }

    initializeSwitchRole() {
        setTimeout(() => {
            this.splashScreen.hide();
        }, 100);
        // this.storage.get('switchRole').then(role => {
        //     if (role) {
        //         this.events.publish('switchRole', role);
        //     } else {
        //         this.events.publish('switchRole', 'customer');
        //     }
        //     setTimeout(() => {
        //         this.splashScreen.hide();
        //     }, 1000);
        // });
    }
}
