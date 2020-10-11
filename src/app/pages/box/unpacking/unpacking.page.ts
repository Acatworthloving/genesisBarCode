import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';

@Component({
    selector: 'app-dump-request',
    templateUrl: './unpacking.page.html'
})
export class UnpackingPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanTypeArr = ['User', 'WX'];
    infoObj: any = {
        wxcode: null,
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
                if (!resp['Data'].length) {
                    this.presentService.presentToast('当前外箱标签未绑定', 'warning');
                    this.infoObj.wxcode = null;
                }
            }
        });
    }

    submit() {
        const LstDetail = [];
        this.scanList.forEach((val) => {
            LstDetail.push({
                DocEntry: this.documentList[0].DocEntry,
                WXCode: this.infoObj.wxcode,
                ItemCode: val.ItemCode,
                ItemName: val.ItemName,
                User: this.infoObj.User,
                Barcode: val.Barcode,
                BatNo: val.BatNo,
                Qty: 1
            });
        });
        this.getDataService.submitPublicData('PXKB/JXSubmitScanData', LstDetail).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }

    scanInput(event) {
        this.addBar(event.value, event.arr);
    }

    addBar(val, arr) {
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode'),
            BFlag = this.publicService.getArrInfo(arr, 'BFlag'),
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber');

        if (BFlag === 'S') {
            // this.presentService.presentToast('当前物料已存在', 'warning');
            // 判断是否扫描重复物料
            const scanItem = this.publicService.arrSameId(this.scanList, 'Barcode', BarcodeText);
            if (scanItem) {
                this.presentService.presentToast('当前物料已扫描', 'warning');
                return false;
            }
            console.log(BarcodeText, this.documentList);
            const docuItem = this.publicService.arrSameId(this.documentList, 'BarCode', BarcodeText);
            if (!docuItem) {
                this.presentService.presentToast('当前物料不存在外箱已绑定明细中', 'warning');
            } else {
                const obj = {
                    ItemCode: ItemCodeText,
                    ItemName: '',
                    Barcode: BarcodeText,
                    BatNo: DistNumber,
                    BFlag: 's',
                    Qty: 1
                };
                this.successScan(obj);
            }
        } else {
            this.presentService.presentToast('只能扫描序列号标签物料', 'warning');
        }
    }

    successScan(obj) {
        this.materieObj = obj;
        this.scanList.unshift(obj);
        this.presentService.presentToast('当前物料扫描成功');
    }
}
