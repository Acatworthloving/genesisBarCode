import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';

@Component({
    selector: 'app-receiving',
    templateUrl: './receiving.page.html'
})
export class ReceivingPage implements OnInit {
    pageType: string = 'getOrder';
    // orderForm: FormGroup;
    documentColumns = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '单据数量',
            prop: 'Quantity',
        },
        {
            name: '未清量',
            prop: 'QTY_NC',
        },
        {
            name: '当前扫描量',
            prop: 'QTY_CUR',
        },
        {
            name: '单号',
            prop: 'DocEntry',
        },
        {
            name: '编号',
            prop: 'DocNum',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '物料规格',
            prop: 'GGXH',
        },
    ];
    columns = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '收货数',
            prop: 'QTY',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '物料规格',
            prop: 'GGXH',
        },
        {
            name: '批次号/外箱序列号/序列号',
            prop: 'BatchNo',
        },
    ];
    documentList: any = [];
    scanList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanTypeArr = ['User', 'DocEntry', 'Whs'];
    infoObj: any = {
        Bil_ID: 'WHSH',
        User: '001',
        Bils_No: null,
        Cus_No: 'C001',
        Whs: 'W01',
    };
    LineNumberList: any = [];

    constructor(
        public presentService: PresentService,
        public publicService: PublicService,
        public dataService: DataService,
        public getDataService: GetDataService,
    ) {
    }

    ngOnInit() {
    }


    segmentChanged(event) {
        this.pageType = event.detail.value;
        this.scanNum = 0;
        this.maxNum = 0;
    }

    clearData() {
        this.scanNum = 0;
        this.maxNum = 0;
        this.infoObj.User = null;
        this.infoObj.Bils_No = null;
        this.infoObj.Cus_No = 'C001';
        this.infoObj.Whs = null;
        this.documentList = [];
        this.scanList = [];
    }

    submit() {
        const LstDetail = [];
        this.scanList.forEach((val) => {
            LstDetail.push({
                Bils_No: val.Bils_No,
                Wh: val.Wh,
                Wh_To: val.Wh_To,
                Itm: val.Itm,
                Barcode: val.Barcode,
                BarcodeText: val.BarcodeText,
                ItemCode: val.ItemCode,
                ItemName: val.ItemName,
                QTY: val.QTY,
                Kuwei: val.Kuwei,
                ToKuwei: val.ToKuwei,
                BFlag: val.BFlag,
                BatchNo: val.BatchNo,
                LiuNo: val.LiuNo,
                QUA_DocEntry: val.QUA_DocEntry,
                QUA_LineNum: val.QUA_LineNum,
            });
        });
        const config = this.infoObj;
        config['LstDetail'] = LstDetail;
        const request = this.dataService.postData('WH/SubmitScanData', config);
        request.subscribe(resp => {
            if (resp) {

            }
        }, error => {
            this.presentService.presentToast(error.message);
        });
    }

    getBillData() {
        this.getDataService.getBillData(this.infoObj).then((resp) => {
            if (resp) {
                if (resp['Data'].length) {
                    resp['Data'].forEach((val) => {
                        val['QTY_NC'] = Number(val.Quantity) - Number(val.QTY_FIN);
                    });
                }
                this.documentList = resp['Data'];
            }
        });
    }

    scanInput(event) {
        this.addBar(event.value, event.arr);
    }

    addBar(val, arr) {
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode');
        let selectItem = {}, documentIndex = null;

        const scanItem = this.publicService.arrSameId(this.scanList, 'Barcode', BarcodeText);
        if (scanItem) {
            this.presentService.presentToast('当前物料已存在', 'warning');
            return false;
        }

        if (ItemCodeText) {
            // 查找单号中是否包含此物料编码
            this.documentList.forEach((item, index) => {
                if (item.ItemCode === ItemCodeText) {
                    item['index'] = index;
                    this.LineNumberList.push(item);
                    // selectItem = item;
                    // documentIndex = index;
                }
            });

            if (this.LineNumberList.length > 1) {
                // 如果同物料编码多行的情况才需要选择行号
                this.presentService.presentAlertRadio(this.LineNumberList).then((res) => {
                    // 选择行号
                    const index = Number(res);
                    if (index || index == 0) {
                        console.log(res);
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
            }
        } else {
            return false;
        }

    }

    addBarDetail(selectItem, documentIndex, BarcodeText, ItemCodeText, val, arr) {
        if (selectItem['ItemName']) {
            if (this.documentList[documentIndex]['QTY_NC'] == 0) {
                this.presentService.presentToast('当前物料扫描完毕', 'warning');
                return;
            }
            const obj = {
                Bils_No: this.infoObj.Bils_No,
                Wh: this.infoObj.Whs,
                Wh_To: '',
                Itm: 0,
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
                QUA_DocEntry: 0,
                QUA_LineNum: 0,
                // QTYNumber: this.publicService.getArrInfo(arr, 'QTY'),
                GGXH: selectItem['GGXH'],
            };

            if (obj.QTY > selectItem['QTY_NC']) {
                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否修改为未清量').then((res) => {
                    if (res) {
                        obj.QTY = this.documentList[documentIndex]['QTY_NC'];
                        this.documentList[documentIndex]['QTY_NC'] = 0;
                        this.documentList[documentIndex]['QTY_CUR'] += obj.QTY;
                        this.scanList.unshift(obj);
                        this.scanNum = obj.QTY;
                        this.maxNum = obj.QTY;
                        this.presentService.presentToast('当前物料扫描成功');
                    } else {
                        this.presentService.presentToast('当前物料扫描失败', 'warning');
                    }
                });
            } else {
                this.documentList[documentIndex]['QTY_NC'] -= obj.QTY;
                this.documentList[documentIndex]['QTY_CUR'] += obj.QTY;
                this.scanNum = this.documentList[documentIndex]['QTY_CUR'];
                this.maxNum = obj.QTY;
                this.scanList.unshift(obj);
                this.presentService.presentToast('当前物料扫描成功');
            }
        } else {
            this.presentService.presentToast('当前单号不存在或已关闭', 'warning');
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
                this.presentService.presentToast('当前物料收货数超过单据明细的物料数量', 'warning');
            } else {
                item['QTY_NC'] = QTY_NC - Number(value);
                item['QTY_CUR'] = Number(item.Quantity) - Number(item.QTY_FIN) - item['QTY_NC'];
                row['QTY'] = value;
                this.scanNum = item['QTY_CUR'];
                this.presentService.presentToast('修改物料收货数成功');
            }
        }
    }
}
