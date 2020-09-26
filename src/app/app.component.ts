
import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private events: Events,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: Storage,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.initializeSwitchRole();
        });
    }

    initializeSwitchRole() {
        setTimeout(() => {
            this.splashScreen.hide();
        }, 1000);
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
