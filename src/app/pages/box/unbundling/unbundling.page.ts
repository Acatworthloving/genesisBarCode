import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';

@Component({
    selector: 'app-dump-request',
    templateUrl: './unbundling.page.html'
})
export class UnbundlingPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanTypeArr = ['User', 'WL', 'WX', 'KB'];
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

    scanKB() {
        const config = {
            kbcode: this.infoObj.kbcode
        };
        this.getDataService.getPublicData('PXKB/GetKBBillData', config).then((resp) => {
            if (resp) {
                this.documentList = resp['Data'];
                if (!resp['Data'].length) {
                    this.presentService.presentToast('当前卡板未绑定', 'warning');
                    this.infoObj.kbcode = null;
                }
            }
        });
    }

    scanWX() {
        const scanItem = this.publicService.arrSameId(this.scanList, 'BarCode', this.infoObj.wxcode);
        if (scanItem) {
            this.presentService.presentToast('当前外箱已存在', 'warning');
            return false;
        }
        const docuItem = this.publicService.arrSameId(this.documentList, 'BarCode', this.infoObj.wxcode);
        if (!docuItem) {
            this.presentService.presentToast('当前外箱不存在卡板已绑定明细中', 'warning');
        } else {
            const obj = {
                KBNum: this.infoObj.kbcode,
                ItemCode: this.infoObj.ItemCode,
                ItemName: '',
                BarCode: this.infoObj.wxcode,
                Qty: 0
            };
            this.successScan(obj);
        }
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
                Qty: val.Qty,
            });
        });
        this.getDataService.submitPublicData('PXKB/JBSubmitScanData', LstDetail).then((resp) => {
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
            this.presentService.presentToast('e40', 'warning');
            return false;
        }
        const docuItem = this.publicService.arrSameId(this.documentList, 'BarCode', BarcodeText);
        if (!docuItem) {
            this.presentService.presentToast('e48', 'warning');
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

    successScan(obj) {
        this.materieObj = obj;
        this.scanList.unshift(obj);
        this.presentService.presentToast('当前外箱扫描成功');
    }
}
