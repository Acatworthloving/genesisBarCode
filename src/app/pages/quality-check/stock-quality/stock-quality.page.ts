import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';

@Component({
    selector: 'app-stock-quality',
    templateUrl: './stock-quality.page.html'
})
export class StockQualityPage implements OnInit {
    title: string = '';
    documentList: any = [];
    scanTypeArr = ['User'];
    documentColumns = [];
    infoObj: any = {
        User: null,
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
            }
        });
        this.documentColumns = this.publicService.Columns6;
    }

    ngOnInit() {
    }

    clearData() {
        this.documentList = [];
    }

    scanInput(event) {
        this.addBar(event.value, event.arr);
    }

    addBar(val, arr) {
        this.documentList = [];
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            DistNumberText: any = this.publicService.getArrInfo(arr, 'DistNumber');
        const config = {
            itemcode: ItemCodeText
        };
        const request = this.dataService.getData('QC/GetItemZZJBillData', config);
        request.subscribe(resp => {
            if (resp) {
                const obj = resp.Data;
                obj['BatNo'] = DistNumberText;
                this.documentList.push(resp.Data);
            }
        }, error => {
            this.presentService.presentToast(error.message);
        });
    }

    submit() {
        const LstDetail = [];
        this.documentList.forEach((val) => {
            if (val.JSQty && val.ZJQty) {
                LstDetail.push(val);
            }
        });
        if (LstDetail.length) {
            const config = this.infoObj;
            config['LstDetail'] = LstDetail;
            this.getDataService.submitPublicData('QC/ItemZJSubmitScanData', config).then((resp) => {
                if (resp) {
                    this.clearData();
                }
            });
        } else {
            this.presentService.presentToast('请完善信息再提交', 'warning');
        }
    }
}
