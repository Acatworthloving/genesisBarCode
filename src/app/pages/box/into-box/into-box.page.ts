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
    templateUrl: './into-box.page.html'
})
export class IntoBoxPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanTypeArr = ['User', 'WX'];
    infoObj: any = {
        wxcode: null,
        ItemCode: null,
        User: null,
    };
    materieObj: any = {};

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
        this.columns = this.publicService.Columns5;
        this.documentColumns = this.publicService.Columns4;
    }

    ngOnInit() {
    }


    segmentChanged(event) {
        this.pageType = event.detail.value;
        this.materieObj = {};
    }

    clearData() {
        this.infoObj.wxcode = null;
        this.scanList = [];
        this.documentList = [];
        this.materieObj = {};
    }

    scanWX() {
        this.getDataService.GetWXBillData(this.infoObj).then((resp) => {
            if (resp) {
                this.documentList = resp['Data'];
            }
        });
    }

    submit() {
        if (!this.infoObj.wxcode) {
            this.presentService.presentToast('e44', 'warning');
            return false;
        }
        const LstDetail = [];
        this.scanList.forEach((val) => {
            LstDetail.push({
                DocEntry: this.documentList.length ? this.documentList[0].DocEntry : 0,
                WXCode: this.infoObj.wxcode,
                ItemCode: val.ItemCode,
                ItemName: val.ItemName,
                User: this.infoObj.User,
                Barcode: val.Barcode,
                BatNo: val.BatNo,
                LiuNo: val.LiuNo,
                Qty: 1
            });
        });
        this.getDataService.PXSubmitScanData(LstDetail).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }

    scanInput(event) {
        // 判断是否扫描重复物料
        const scanItem = this.publicService.arrSameId(this.scanList, 'Barcode', event.value);
        if (scanItem) {
            this.presentService.presentToast('e04', 'warning');
            return false;
        }
        const obj = {
            ItemCode: this.infoObj.ItemCode,
            ItemName: '',
            Barcode: event.value,
            BatNo: event.value,
            BFlag: 'S',
            LiuNo: event.value,
            Qty: 1
        };
        this.materieObj = obj;
        this.scanList.unshift(obj);
        this.presentService.presentToast('e15');
    }
}
