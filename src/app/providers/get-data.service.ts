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
                this.presentService.presentToast(error.message);
                resolve(false);
            });
        });
    }

    getSapStoreQty(Obj) {
        return new Promise((resolve, reject) => {
            const config = {
                itemcode: Obj.ItemCode,
                wh: Obj.Wh,
                kw: Obj.Kuwei,
                batNo: Obj.BatchNo,
                batId: Obj.BFlag,
            };
            const request = this.dataService.getData('WH/GetSapStoreQty', config);
            request.subscribe(resp => {
                resolve(resp);
            }, error => {
                this.presentService.presentToast(error.message);
                resolve(false);
            });
        });
    }
}
