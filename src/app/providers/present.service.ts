import {Injectable} from '@angular/core';
import {ToastController, LoadingController, AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {GlobalFooService} from '../providers/events.service';

// import {UserDataService} from './user-data.service';

@Injectable({
    providedIn: 'root'
})
export class PresentService {
    loading: any = false;
    toast: any = false;

    constructor(
        public toastController: ToastController,
        public loadingController: LoadingController,
        public alertController: AlertController,
        public router: Router,
        private globalFooService: GlobalFooService
        // public userData: UserDataService,
    ) {
    }

    Tips = {
        e01: '请按照单据全部扫描',
        e02: '请检查单据状态',
        e03: '此标签没有绑定产品',
        e04: '请勿重复扫描标签',
        e05: '不允许超订单收货',
        e06: '标签数量超过未清数量',
        e07: '不是这个生产订单产品',
        e08: '删除成功',
        e09: '账户已在其他条码枪登录',
        e10: '请检查单据状态',
        e11: '不允许超订单收货',
        e12: '已更新收货数量',
        e13: '数量修改失败',
        e14: '扫描失败',
        e15: '物料扫描成功',
        e16: '员工扫描成功',
        e17: '不需要扫描员工',
        e18: '生产线扫描成功',
        e19: '不需要扫描生产线',
        e20: '卡板扫描成功',
        e21: '不需要扫描卡板',
        e22: '外箱扫描成功',
        e23: '不需要扫描外箱',
        e24: '单据扫描成功',
        e25: '不需要扫描单据',
        e26: '仓库扫描成功',
        e27: '不需要扫描仓库',
        e28: '请先扫描发出仓库',
        e29: '请先扫描员工',
        e30: '当前物料库存不足',
        e31: '请检查单据状态',
        e32: '无效扫描',
        e33: '拣配清单扫描成功',
        e34: '请先补充下工记录',
        e35: '请先补充上工记录',
        e36: '请先解除上一警报',
        e37: '清单扫描成功',
        e38: '请先扫描生产线',
        e39: '请先扫描仓库',
        e40: '请勿重复扫描外箱标签',
        e41: '请勿重复扫描卡板标签',
        e42: '当前物料扫描完毕',
        e43: '请先扫描单号',
        e44: '请先扫描外箱',
        e45: '请先扫描卡板',
        e46: '请扫描正确的单据',
        e47: '请扫描正确的产品',
        e48: '当前物料不存在外箱已绑定明细中',
        e49: '当前外箱已被绑定',
        e50: '请勿重复扫描外箱',
        e51: '当前单据明细的物料非序列号管理',
        e52: '不是本单据物料',
        e53: '送检数量不能等于0',
        e54: '请先扫描产品',
        e55: '此物料不在清单中或未清量为0',
    };

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

    presentAlertReturn() {
        return new Promise((resolve, reject) => {
            this.AlertReturn(resolve);
        });
    }

    presentAlertBaseRadio(list, title) {
        return new Promise((resolve, reject) => {
            this.AlertBaseRadio(list, title, resolve);
        });
    }

    presentAlertBaseInput() {
        return new Promise((resolve, reject) => {
            this.AlertBaseInput(resolve);
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
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }, {
                    text: '确定',
                    handler: () => {
                        resolve(true);
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
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
                name: Number(val.LineNum) + 1,
                type: 'radio',
                label: Number(val.LineNum) + 1,
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
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }, {
                    text: '确定',
                    handler: (resp) => {
                        resolve(resp);
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    async AlertBaseInput(resolve) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '输入打印次数',
            inputs: [{
                name: 'NUM',
                type: 'number',
                placeholder: '打印次数'
            }],
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        resolve(false);
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }, {
                    text: '确定',
                    handler: (resp) => {
                        resolve(resp);
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    async AlertReturnInput(resolve) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '输入打印次数',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        resolve('false');
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }, {
                    text: '确定',
                    handler: (resp) => {
                        resolve('true');
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    async AlertReturn(resolve) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '确定退出当前页？',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        resolve('false');
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }, {
                    text: '确定',
                    handler: (resp) => {
                        resolve('true');
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
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
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }, {
                    text: '确定',
                    handler: (resp) => {
                        resolve(resp);
                        this.globalFooService.publishSomeData({
                            foo: 'bar'
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    async presentToast(msg: string, color?: any, duration?: number, position?: any) {
        this.dismissToast();
        if (this.Tips[msg]) {
            msg = this.Tips[msg];
        }
        this.toast = await this.toastController.create({
            message: msg,
            color: color || 'success', // primary,success,warning,danger,light
            position: position || 'top',
            duration: duration || 1000000000,
            showCloseButton: true,
            closeButtonText: '关闭'
        });
        if (msg === 'e403') {
            setTimeout(() => {
                // this.userData.logout();
                this.router.navigateByUrl('/login');
            }, 2000);
        }
        if (this.toast) {
            this.toast.dismiss();
            setTimeout(() => {
                this.toast.present();
            }, 500);
        } else {
            this.toast.present();
        }
    }

    dismissToast() {
        if (this.toast) {
            this.toast.dismiss();
        }
    }

    async presentLoading(messages?: string, position?: any, duration?: number) {
        const config = {
            duration: duration || 1000
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
        }, 1000);
    }
}
