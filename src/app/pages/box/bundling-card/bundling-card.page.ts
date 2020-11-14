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
    templateUrl: './bundling-card.page.html'
})
export class BundlingCardPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanTypeArr = ['User', 'WX', 'WL', 'KB'];
    infoObj: any = {
        wxcode: null,
        kbcode: null,
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
        this.columns = this.publicService.Columns7;
        this.documentColumns = this.publicService.Columns7;
    }

    ngOnInit() {
    }


    segmentChanged(event) {
        this.pageType = event.detail.value;
        this.materieObj = {};
    }

    clearData() {

        this.infoObj.wxcode = null;
        this.infoObj.ItemCode = null;
        this.infoObj.kbcode = null;
        this.scanList = [];
        this.documentList = [];
        this.materieObj = {};
    }

    scanWX() {
        if (!this.infoObj.kbcode) {
            this.presentService.presentToast('e45', 'warning');
        }
        const scanItem = this.publicService.arrSameId(this.scanList, 'BarCode', this.infoObj.wxcode);
        if (scanItem) {
            this.presentService.presentToast('e50', 'warning');
            return false;
        }
        const config = {
            barcode: this.infoObj.wxcode,
            codetype: 24
        };
        this.getDataService.getPublicData('PXKB/GetExistWXCode', config).then((resp) => {
            if (resp) {
                if (resp['Data']) {
                    this.presentService.presentToast('e49', 'warning');
                } else {
                    const obj = {
                        codetype: 24,
                        KBNum: this.infoObj.kbcode,
                        ItemCode: this.infoObj.ItemCode,
                        ItemName: '',
                        BarCode: this.infoObj.wxcode,
                        QTY: 1,
                        BFlag: 'S'
                    };
                    this.successScan(obj);
                }
            }
        });
    }

    scanKB() {
        if (!this.infoObj.kbcode) {
            this.presentService.presentToast('e45', 'warning');
        }
        const config = {
            kbcode: this.infoObj.kbcode
        };
        this.getDataService.getPublicData('PXKB/GetKBBillData', config).then((resp) => {
            if (resp) {
                this.documentList = resp['Data'];
            }
        });
    }

    submit() {
        const LstDetail = [];
        this.scanList.forEach((val) => {
            LstDetail.push({
                DocEntry: this.documentList.length ? this.documentList[0].DocEntry : 0,
                KBNum: val.KBNum,
                ItemCode: val.ItemCode,
                ItemName: val.ItemName,
                User: this.infoObj.User,
                BarCode: val.BarCode,
                BatNo: val.BatNo,
                CodeType: val.codetype,
                QTY: val.codetype == 24 ? 0 : val.QTY,
            });
        });
        this.getDataService.submitPublicData('PXKB/KBSubmitScanData', LstDetail).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }

    scanInput(event) {
        const arr = event.arr;
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode'),
            BFlagText = this.publicService.getArrInfo(arr, 'BFlag'),
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber'),
            QTYNUM = this.publicService.getArrInfo(arr, 'QTY');
        const scanItem = this.publicService.arrSameId(this.scanList, 'BarCode', BarcodeText);
        if (scanItem) {
            this.presentService.presentToast('e50', 'warning');
            return false;
        }
        const config = {
            barcode: BarcodeText,
            codetype: 10
        };
        this.getDataService.getPublicData('PXKB/GetExistWXCode', config).then((resp) => {
            if (resp) {
                if (resp['Data']) {
                    this.presentService.presentToast('当前序列号标签已绑定', 'warning');
                } else {
                    this.infoObj['wxcode'] = DistNumber;
                    const obj = {
                        codetype: 10,
                        KBNum: this.infoObj.kbcode,
                        ItemCode: ItemCodeText,
                        ItemName: '',
                        BarCode: BarcodeText,
                        BFlag: BFlagText,
                        exitQty: true,
                        QTY: QTYNUM
                    };
                    this.successScan(obj);
                }
            }
        });
    }

    successScan(obj) {
        this.materieObj = obj;
        this.scanList.unshift(obj);
        this.presentService.presentToast('当前外箱扫描成功');
    }
}
