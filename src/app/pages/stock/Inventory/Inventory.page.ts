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
    templateUrl: './Inventory.page.html'
})
export class InventoryPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    columns = [];
    scanList: any = [];
    documentList: any = [];
    documentTwoList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanTypeArr = ['User', 'Whs'];
    infoObj: any = {
        Bil_ID: null,
        User: '8',
        Bils_No: null,
        Cus_No: '',
        Whs: 'W01',
        wxcode: null,
        ItemCode: null,
        PDType: '非批次盘点'
    };
    BFlagObj = {};
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
                this.infoObj.Bil_ID = res['id'];
            }
        });
        this.columns = this.publicService.Columns10;
    }

    ngOnInit() {
        this.getBillData();
    }


    segmentChanged(event) {
        this.pageType = event.detail.value;
        this.scanNum = 0;
        this.maxNum = 0;
        this.materieObj = {};
    }

    clearData() {
        this.scanNum = 0;
        this.maxNum = 0;
        this.infoObj.Bils_No = null;
        this.infoObj.Cus_No = '';
        this.infoObj.Whs = null;
        this.infoObj.Wh_To = null;
        this.infoObj.wxcode = null;
        this.infoObj.ItemCode = null;
        this.scanList = [];
        this.materieObj = {};
    }

    getBillData() {
        this.getDataService.getPublicData('PD/GetBillData', {}).then((res) => {
            if (res) {
                this.documentList = res['Data'];
                const arr = JSON.stringify(res['Data']);
                this.documentTwoList = JSON.parse(arr);
            }
        });
    }

    submit() {
        if (this.scanList.length) {
            const LstDetail = [];
            this.scanList.forEach((val) => {
                LstDetail.push({
                    DocEntry: this.documentList.length ? this.documentList[0].DocEntry : -1,
                    LineId: -1,
                    PDType: this.infoObj.PDType,
                    User: this.infoObj.User,
                    BarCode: val.BarCode,
                    ItemCode: val.ItemCode,
                    ItemName: val.ItemName,
                    QTY: val.QTY,
                    WH: this.infoObj.Whs,
                    BatNo: val.BatNo,
                    BFlag: val.BFlag
                });
            });
            this.getDataService.SubmitAddPD(LstDetail).then((resp) => {
                if (resp) {
                    this.SubmitScanData();
                }
            });
        } else {
            this.SubmitScanData();
        }
    }

    SubmitScanData(type?) {
        if (this.documentTwoList.length) {
            const ListDetail = [];
            this.documentTwoList.forEach((val) => {
                const item = this.publicService.arrSameId(this.documentList, 'BarCode', val.BarCode);
                if (!item) {
                    ListDetail.push({
                        DocEntry: val.DocEntry,
                        LineId: val.LineId,
                        // PDType: this.infoObj.PDType,
                        User: this.infoObj.User,
                        BarCode: val.BarCode,
                        ItemCode: val.ItemCode,
                        ItemName: val.ItemName,
                        QTY: val.QTY,
                        WH: val.Whs,
                        BatNo: val.BatNo,
                        BFlag: val.BFlag,
                        Delete: 'Y',
                    });
                } else {
                    if (item['change']) {
                        ListDetail.push({
                            DocEntry: val.DocEntry,
                            LineId: val.LineId,
                            // PDType: this.infoObj.PDType,
                            User: this.infoObj.User,
                            BarCode: val.BarCode,
                            ItemCode: val.ItemCode,
                            ItemName: val.ItemName,
                            QTY: item['QTY'],
                            WH: val.Whs,
                            BatNo: val.BatNo,
                            BFlag: val.BFlag,
                            Delete: 'N',
                        });
                    }
                }
            });
            this.getDataService.SubmitModifyPD(ListDetail).then((resp) => {
                if (resp) {
                    this.getBillData();
                    this.clearData();
                    this.presentService.presentToast('盘点数据提交成功');
                }
            });
        } else {
            this.clearData();
            this.presentService.presentToast('盘点数据提交成功');
        }
    }

    scanWX() {
        const config = {
            wxcode: this.infoObj.wxcode
        };
        this.getDataService.getPublicData('PXKB/GetWXBillData', config).then((resp) => {
            if (resp) {
                if (resp['Data'] && resp['Data'].length) {
                    resp['Data'].forEach((val) => {
                        this.scanList.unshift(val);
                    });
                }
            }
        });
    }

    scanInput(event) {
        this.addBar(event.value, event.arr);
    }

    addBar(val, arr) {
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode'),
            BFlagText = this.publicService.getArrInfo(arr, 'BFlag'),
            QtyText = this.publicService.getArrInfo(arr, 'QTY'),
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber'),
            key = BFlagText + DistNumber;

        //  判断是否存在物料编码
        if (ItemCodeText) {
            const obj = {
                DocEntry: 0,
                LineId: 0,
                BarCode: BarcodeText,
                ItemCode: ItemCodeText,
                ItemName: '',
                QTY: QtyText,
                BatNo: DistNumber,
                BFlag: BFlagText
            };
            this.successScan(obj);
        } else {
            return false;
        }
    }

    successScan(obj) {
        this.materieObj = obj;
        this.scanList.unshift(obj);
        this.presentService.presentToast('当前物料扫描成功');
    }

    changeQTY(event, type?) {
        let value: any = '', index: any = 0;
        if (type === 'row') {
            // 修改扫描页面row发料数量数据
            value = event.target.value;
            this.scanList[0]['QTY'] = value;
        } else {
            // 修改表格数据
            value = event.event.target.value;
            index = event.index;
            this.scanList[index]['QTY'] = value;
        }
    }
}
