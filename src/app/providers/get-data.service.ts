import {Injectable} from '@angular/core';
import {ToastController, LoadingController, AlertController} from '@ionic/angular';
// import { TranslateService } from '@ngx-translate/core';
import {Router} from '@angular/router';
import {PresentService} from './present.service';
import {PublicService} from './public.service';
import {DataService} from '../api/data.service';

// import {UserDataService} from './user-data.service';

@Injectable({
    providedIn: 'root'
})
export class GetDataService {
    loading: any = false;

    constructor(
        public presentService: PresentService,
        public dataService: DataService,
        public router: Router,
    ) {
    }

    getBillData(infoObj) {
        return new Promise((resolve, reject) => {
            const config = {
                order: infoObj.Bils_No,
                actType: infoObj.Bil_ID,
            };
            const request = this.dataService.getData('WH/GetBillData', config);
            request.subscribe(resp => {
                resolve(resp);
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    getCGBillData(infoObj) {
        return new Promise((resolve, reject) => {
            const config = {
                order: infoObj.Bils_No,
                actType: infoObj.Bil_ID,
            };
            const request = this.dataService.getData('CG/GetBillData', config);
            request.subscribe(resp => {
                resolve(resp);
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    GetWXBillData(infoObj) {
        return new Promise((resolve, reject) => {
            const config = {
                wxcode: infoObj.wxcode
            };
            const request = this.dataService.getData('PXKB/GetWXBillData', config);
            request.subscribe(resp => {
                resolve(resp);
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    GetKBBillData(infoObj) {
        return new Promise((resolve, reject) => {
            const config = {
                wxcode: infoObj.wxcode
            };
            const request = this.dataService.getData('PXKB/GetWXBillData', config);
            request.subscribe(resp => {
                resolve(resp);
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    GetExistBarCode(code) {
        return new Promise((resolve, reject) => {
            const config = {
                barcode: code
            };
            const request = this.dataService.getData('PXKB/GetExistBarCode', config);
            request.subscribe(resp => {
                resolve(resp);
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    getSapStoreQty(config) {
        const data = {};
        return new Promise((resolve, reject) => {
            const request = this.dataService.getData('WH/GetSapStoreQty', config);
            request.subscribe(resp => {
                resolve(resp);
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    SubmitScanData(Obj) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.postData('WH/SubmitScanData', Obj);
            request.subscribe(resp => {
                if (resp) {
                    this.presentService.presentToast(resp.ErrMsg);
                    resolve(resp);
                }
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    CGSJSubmitScanData(Obj) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.postData('QC/CGSJSubmitScanData', Obj);
            request.subscribe(resp => {
                if (resp) {
                    this.presentService.presentToast(resp.ErrMsg);
                    resolve(resp);
                }
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    CGZJSubmitScanData(Obj) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.postData('QC/CGZJSubmitScanData', Obj);
            request.subscribe(resp => {
                if (resp) {
                    this.presentService.presentToast(resp.ErrMsg);
                    resolve(resp);
                }
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    PXSubmitScanData(Obj) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.postData('PXKB/PXSubmitScanData', Obj);
            request.subscribe(resp => {
                if (resp) {
                    this.presentService.presentToast(resp.ErrMsg);
                    resolve(resp);
                }
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    CGSubmitScanData(Obj) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.postData('CG/SubmitScanData', Obj);
            request.subscribe(resp => {
                if (resp) {
                    this.presentService.presentToast(resp.ErrMsg);
                    resolve(resp);
                }
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    submitPublicData(api, Obj) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.postData(api, Obj);
            request.subscribe(resp => {
                if (resp) {
                    this.presentService.presentToast(resp.ErrMsg);
                    resolve(resp);
                }
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    SubmitAddPD(Obj) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.postData('PD/SubmitScanData', Obj);
            request.subscribe(resp => {
                if (resp) {
                    resolve(resp);
                }
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    SubmitModifyPD(Obj) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.postData('PD/ModifyScanData', Obj);
            request.subscribe(resp => {
                if (resp) {
                    resolve(resp);
                }
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }

    getPublicData(url, config) {
        return new Promise((resolve, reject) => {
            const request = this.dataService.getData(url, config);
            request.subscribe(resp => {
                resolve(resp);
            }, error => {
                this.presentService.presentToast(error.message, 'warning');
                resolve(false);
            });
        });
    }
}
