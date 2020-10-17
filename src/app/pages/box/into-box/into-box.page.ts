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
                this.presentService.presentToast('当前物料已存在', 'warning');
                return false;
            }
            const docuItem = this.publicService.arrSameId(this.documentList, 'Barcode', BarcodeText);
            if (docuItem) {
                this.presentService.presentToast('当前物料已存在', 'warning');
                return false;
            }
            if (this.scanList.length) {
                if (this.scanList[0]['ItemCode'] !== ItemCodeText) {
                    this.presentService.presentToast('只允许扫描同一种物料编码', 'warning');
                    return false;
                }
            } else {
                if (this.documentList.length) {
                    if (this.documentList[0]['ItemCode'] !== ItemCodeText) {
                        this.presentService.presentToast('只允许扫描同一种物料编码', 'warning');
                        return false;
                    }
                }
            }

            this.getDataService.GetExistBarCode(BarcodeText).then((resp) => {
                if (resp) {
                    if (resp['Data']) {
                        this.presentService.presentToast('当前序列号标签已绑定', 'warning');
                    } else {
                        if (ItemCodeText) {
                            const obj = {
                                ItemCode: ItemCodeText,
                                ItemName: '',
                                Barcode: BarcodeText,
                                BatNo: DistNumber,
                                BFlag: 's',
                                LiuNo: this.infoObj.ItemCode,
                                Qty: 1
                            };
                            this.successScan(obj);
                        }
                    }
                }
            });

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
