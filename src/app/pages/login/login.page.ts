import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, Params, NavigationExtras} from '@angular/router';
import { Events, NavController } from '@ionic/angular';
import {DataService} from '../../api/data.service';
import {PresentService} from '../../providers/present.service';
import {UserDataService} from '../../providers/user-data.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
})
export class LoginPage {
    loginForm: FormGroup;

    constructor(public router: Router,
                public dataService: DataService,
                public presentService: PresentService,
                private navCtrl: NavController,
                public userData: UserDataService) {
        const EMAILPATTERN = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
        this.loginForm = new FormGroup({
            account: new FormControl('001', [Validators.required]),
            password: new FormControl('1234', [Validators.required]),
        });
    }
    ionViewWillEnter() {
        this.userData.isLoggedIn().then(isLogin => {
            if (isLogin == true) {
                this.router.navigateByUrl('/home');
            }
        });
    }
    onLogin(form) {
        const config = form.value;
        this.dataService.postData('Home/GetAccessToken', config).subscribe(resp => {
            if (resp) {
                this.userData.setToken(resp.Token);
                this.navCtrl.navigateRoot('home');
                // this.router.navigate(['/home']);
            }
        }, error => {
            this.presentService.dismissLoading();
            this.presentService.presentToast(error.message);
        });
    }
}
