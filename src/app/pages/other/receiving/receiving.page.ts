import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';

@Component({
    selector: 'app-receiving',
    templateUrl: './receiving.page.html'
})
export class ReceivingPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanTypeArr = ['User', 'DocEntry', 'Whs'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        Bils_No: null,
        Cus_No: '',
        Whs: null,
        CRKType: '供应商赠品'
    };
    LineNumberList: any = [];
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
        this.documentColumns = this.publicService.DocumentColumns;
        this.columns = this.publicService.TableColumns;
    }

    ngOnInit() {
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
        this.documentList = [];
        this.scanList = [];
        this.materieObj = {};
    }

    submit() {
        if (!this.infoObj['Whs']) {
            this.presentService.presentToast('e39', 'warning');
            return false;
        }
        this.infoObj.Cus_No = this.documentList[0].CardCode || '';
        const hasQTYNC = this.publicService.hasQTY_NC(this.documentList);
        if (hasQTYNC) {
            return false;
        }
        const LstDetail = [];
        this.scanList.forEach((val) => {
            LstDetail.push({
                Bils_No: val.Bils_No,
                Wh: val.Whs,
                Wh_To: val.Wh_To,
                Itm: val.Itm,
                Barcode: val.Barcode,
                BarcodeText: val.BarcodeText,
                ItemCode: val.ItemCode,
                ItemName: val.ItemName,
                QTY: val.QTY,
                Kuwei: this.infoObj.Kuwei,
                ToKuwei: this.infoObj.ToKuwei,
                BFlag: val.BFlag,
                BatchNo: val.BatchNo,
                LiuNo: val.LiuNo,
                OrderEntry: val.OrderEntry || '',
                OrderLine: val.OrderLine || '',
                NumPerMsr: val.NumPerMsr,
                // QUA_DocEntry: val.QUA_DocEntry,
                // QUA_LineNum: val.QUA_LineNum,
            });
        });
        const config = this.infoObj;
        config['LstDetail'] = LstDetail;
        this.getDataService.SubmitScanData(config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }

    getBillData() {
        this.getDataService.getBillData(this.infoObj).then((resp) => {
            if (resp) {
                if (resp['Data'].length) {
                    resp['Data'].forEach((val) => {
                        val['QTY_NC'] = Number(val.Quantity) - Number(val.QTY_FIN);
                    });
                } else {
                    this.presentService.presentToast('e02', 'warning');
                    this.infoObj.Bils_No = null;
                }
                this.documentList = resp['Data'];
            } else {
                this.infoObj.Bils_No = null;
            }
        });
    }

    scanInput(event) {
        this.addBar(event.value, event.arr);
    }

    addBar(val, arr) {
        if (!this.documentList.length) {
            this.presentService.presentToast('e02', 'warning');
            return false;
        }
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode');
        let selectItem = {}, documentIndex = null;
        // 清空行号
        this.LineNumberList = [];

        // 判断是否扫描重复物料
        const scanItem = this.publicService.arrSameId(this.scanList, 'Barcode', BarcodeText);
        if (scanItem) {
            this.presentService.presentToast('e04', 'warning');
            return false;
        }
        //  判断是否存在物料编码
        if (ItemCodeText) {
            // 查找单号中是否包含此物料编码
            this.documentList.forEach((item, index) => {
                if (item.ItemCode === ItemCodeText) {
                    if (item['QTY_NC'] > 0) {
                        item['index'] = index;
                        this.LineNumberList.push(item);
                    }
                }
            });

            if (this.LineNumberList.length > 1) {
                // 如果同物料编码多行的情况才需要选择行号
                this.presentService.presentAlertRadio(this.LineNumberList).then((res) => {
                    // 选择行号
                    const index = Number(res);
                    if (index || index == 0) {
                        selectItem = this.LineNumberList[index];
                        documentIndex = this.LineNumberList[index]['index'];
                        this.addBarDetail(selectItem, documentIndex, BarcodeText, ItemCodeText, val, arr);
                    }
                });
            } else if (this.LineNumberList.length == 1) {
                // 只有一个物料编码的情况
                selectItem = this.LineNumberList[0];
                documentIndex = this.LineNumberList[0]['index'];
                this.addBarDetail(selectItem, documentIndex, BarcodeText, ItemCodeText, val, arr);
            } else {
                this.presentService.presentToast('e04', 'warning');
            }
        } else {
            return false;
        }

    }

    addBarDetail(selectItem, documentIndex, BarcodeText, ItemCodeText, val, arr) {
        if (selectItem['ItemName']) {
            if (this.documentList[documentIndex]['QTY_NC'] == 0) {
                this.presentService.presentToast('e04', 'warning');
                return;
            }
            const obj = {
                Whs: this.infoObj.Whs,
                Wh_To: this.infoObj.Wh_To || '',
                Bils_No: this.infoObj.Bils_No,
                Itm: selectItem['LineNum'],
                Barcode: BarcodeText,
                BarcodeText: val,
                ItemCode: ItemCodeText,
                ItemName: selectItem['ItemName'],
                QTY: Number(this.publicService.getArrInfo(arr, 'QTY')),
                Kuwei: '',
                ToKuwei: '',
                BFlag: this.publicService.getArrInfo(arr, 'BFlag'),
                BatchNo: this.publicService.getArrInfo(arr, 'DistNumber'),
                LiuNo: this.publicService.getArrInfo(arr, 'LiuNo'),
                OrderEntry: selectItem['OrderEntry'] || '',
                OrderLine: selectItem['OrderLine'] || '',
                NumPerMsr: selectItem['NumPerMsr'],
                DocNum: selectItem['DocNum'],
                DocEntry: selectItem['DocEntry'],
                QUA_DocEntry: 0,
                QUA_LineNum: 0,
                // QTYNumber: this.publicService.getArrInfo(arr, 'QTY'),
                GGXH: selectItem['GGXH'],
            };

            if (obj.QTY > selectItem['QTY_NC']) {
                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否修改为未清量').then((wql) => {
                    if (wql) {
                        obj.QTY = this.documentList[documentIndex]['QTY_NC'];
                        this.documentList[documentIndex]['QTY_NC'] = 0;
                        this.documentList[documentIndex]['QTY_CUR'] += obj.QTY;
                        this.scanList.unshift(obj);
                        this.scanNum = obj.QTY;
                        this.maxNum = obj.QTY;
                        this.materieObj = obj;
                        this.presentService.presentToast('e15');
                    } else {
                        this.presentService.presentToast('e14', 'warning');
                    }
                });
            } else {
                this.documentList[documentIndex]['QTY_NC'] -= obj.QTY;
                this.documentList[documentIndex]['QTY_CUR'] += obj.QTY;
                this.scanNum = this.documentList[documentIndex]['QTY_CUR'];
                this.maxNum = obj.QTY;
                this.materieObj = obj;
                this.scanList.unshift(obj);
                this.presentService.presentToast('e15');
            }
        } else {
            this.presentService.presentToast('e10', 'warning');
        }
    }

    changeQTY(event) {
        const row = this.scanList[0];
        const value = event.target.value, oldNum = this.maxNum;
        const item = this.publicService.arrSameId(this.documentList, 'ItemCode', row.ItemCode);
        if (item) {
            const QTY_NC = Number(item['QTY_NC']) + Number(oldNum);
            if (value > QTY_NC) {
                row['QTY'] = oldNum;
                this.presentService.presentToast('e11', 'warning');
            } else {
                item['QTY_NC'] = QTY_NC - Number(value);
                item['QTY_CUR'] = Number(item.Quantity) - Number(item.QTY_FIN) - item['QTY_NC'];
                row['QTY'] = value;
                this.scanNum = item['QTY_CUR'];
                this.presentService.presentToast('e12');
            }
        }
    }
}
