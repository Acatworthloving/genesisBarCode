import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {DataService} from '../../../api/data.service';
import {GetDataService} from '../../../providers/get-data.service';
import {AlertController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';

@Component({
    selector: 'app-transfer-order',
    templateUrl: './query.page.html'
})
export class QueryPage implements OnInit {
    title: string = '';
    scanTypeArr = ['Whs'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        Whs: null,
        Kuwei: null,
        ItemCode: null,
        SapQty: 0,
        XLPCQty: 0,
        batNo: null,
        batId: null,
    };

    constructor(
        public presentService: PresentService,
        public publicService: PublicService,
        public dataService: DataService,
        public getDataService: GetDataService,
        public activatedRoute: ActivatedRoute,
        public pageRouterService: PageRouterService
    ) {
        this.pageRouterService.getPageParams().then((res) => {
            if (res) {
                this.title = res['name'];
                this.infoObj.Bil_ID = res['id'];
            }
        });
    }

    ngOnInit() {
    }


    scanWX() {
        const config = {
            itemcode: this.infoObj.ItemCode,
            wh: this.infoObj.Whs,
            kw: '',
            batNo: '',
            batId: 'N',
        };
        this.infoObj.batNo = '';
        this.infoObj.batId = '';
        this.getItemCodeQty(config);
    }

    scanInput(event) {
        this.addBar(event.value, event.arr);
    }

    addBar(val, arr) {
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            BFlag = this.publicService.getArrInfo(arr, 'BFlag'),
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber');
        const config = {
            itemcode: ItemCodeText,
            wh: this.infoObj.Whs,
            kw: '',
            batNo: DistNumber,
            batId: BFlag,
        };

        this.infoObj.ItemCode = ItemCodeText;
        this.infoObj.batNo = DistNumber;
        this.infoObj.batId = BFlag;
        this.getItemCodeQty(config);
    }

    getItemCodeQty(config) {
        this.getDataService.getPublicData('WH/GetItemCodeQty', config).then((res) => {
            if (res && res['Data']) {
                this.infoObj.SapQty = res['Data']['SapQty'];
                this.infoObj.XLPCQty = res['Data']['XLPCQty'];
            }
        });
    }
}
