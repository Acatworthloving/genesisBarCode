import {Injectable} from '@angular/core';
import {ToastController, LoadingController, AlertController} from '@ionic/angular';
// import { TranslateService } from '@ngx-translate/core';
import {Router} from '@angular/router';
import {forEach} from '@angular-devkit/schematics';

// import {UserDataService} from './user-data.service';

@Injectable({
    providedIn: 'root'
})
export class PresentService {
    loading: any = false;

    constructor(
        public toastController: ToastController,
        public loadingController: LoadingController,
        public alertController: AlertController,
        public router: Router,
        // public userData: UserDataService,
    ) {
    }

    // async presentAlert(message: string) {
    //     const alert = await this.alertController.create({
    //         header: 'Warning',
    //         subHeader: message,
    //         buttons: ['OK']
    //     });
    //     await alert.present();
    // }
    presentAlert(message) {
        return new Promise((resolve, reject) => {
            this.Alert(message, resolve);
        });
    }

    presentAlertRadio(list) {
        return new Promise((resolve, reject) => {
            this.AlertRadio(list, resolve);
        });
    }

    presentAlertBaseRadio(list, title) {
        return new Promise((resolve, reject) => {
            this.AlertBaseRadio(list, title, resolve);
        });
    }

    async Alert(message: string, resolve) {
        const alert = await this.alertController.create({
            header: '提示',
            subHeader: message,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        resolve(false);
                    }
                }, {
                    text: '确定',
                    handler: () => {
                        resolve(true);
                    }
                }
            ]
        });
        await alert.present();
    }


    async AlertRadio(list, resolve) {
        const inputList = [];
        list.forEach((val, index) => {
            inputList.push({
                name: val.LineNum,
                type: 'radio',
                label: val.LineNum,
                value: index,
            });
        });
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '请选择行号，记录当前扫描物料到指定行',
            inputs: inputList,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        resolve(false);
                    }
                }, {
                    text: '确定',
                    handler: (resp) => {
                        resolve(resp);
                    }
                }
            ]
        });
        await alert.present();
    }

    async AlertBaseRadio(list, title, resolve) {
        const inputList = [];
        list.forEach((val, index) => {
            inputList.push({
                name: val.title,
                type: 'radio',
                label: val.title,
                value: val.value,
            });
        });
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: title,
            inputs: inputList,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        resolve(false);
                    }
                }, {
                    text: '确定',
                    handler: (resp) => {
                        resolve(resp);
                    }
                }
            ]
        });
        await alert.present();
    }

    async presentToast(msg: string, color?: any, position?: any, duration?: number) {
        const toast = await this.toastController.create({
            message: msg,
            color: color || 'success', //primary,success,warning,danger,light
            position: position || 'top',
            duration: duration || 2000
        });
        if (msg === 'e403') {
            setTimeout(() => {
                // this.userData.logout();
                this.router.navigateByUrl('/login');
            }, 2000);
        }
        if (this.loading) {
            setTimeout(() => {
                toast.present();
            }, 500);
        } else {
            toast.present();
        }
    }

    async presentLoading(messages?: string, position?: any, duration?: number) {
        const config = {
            duration: duration || 10000
        };
        if (messages) {
            Object.assign(config, {message: messages});
        }
        const loading = await this.loadingController.create(config);
        this.loading = loading;
        await loading.present();
    }

    dismissLoading() {
        setTimeout(() => {
            if (this.loading) {
                this.loading.dismiss();
            }
        }, Math.random() * (1000 + 1 - 300) + 300);
    }


}
