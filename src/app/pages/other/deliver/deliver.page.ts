import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {DataService} from '../../../api/data.service';
import {GetDataService} from '../../../providers/get-data.service';

@Component({
    selector: 'app-deliver',
    templateUrl: './deliver.page.html'
})
export class DeliverPage implements OnInit {
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
    scanBFlagS: boolean = false;
    scanTypeArr = ['User', 'DocEntry', 'Whs'];
    infoObj: any = {
        Bil_ID: 'WHFH',
        User: '001',
        Bils_No: null,
        Cus_No: 'C001',
        Whs: 'W01',
    };
    BFlagObj = {};

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
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode'),
            BFlag = this.publicService.getArrInfo(arr, 'BFlag'),
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber'),
            key = BFlag + DistNumber;
        let selectItem = {}, documentIndex = null;

        // // 序列号管理，只能存在一条数据
        // if (BFlag === 'S') {
        //     this.scanBFlagS = true;
        // } else {
        //     this.scanBFlagS = false;
        // }

        // 序列号管理，只能存在一条数据
        if (BFlag === 'S' && this.BFlagObj[key]) {
            this.presentService.presentToast('当前物料已存在', 'warning');
        }

        //  判断是否存在物料编码
        if (ItemCodeText) {
            // 查找单号中是否包含此物料编码
            this.documentList.forEach((item, index) => {
                if (item.ItemCode === ItemCodeText) {
                    selectItem = item;
                    documentIndex = index;
                }
            });
        } else {
            return false;
        }
        // 判断是否扫描重复物料
        const scanItem = this.publicService.arrSameId(this.scanList, 'Barcode', BarcodeText);
        if (scanItem) {
            this.presentService.presentToast('当前物料已存在', 'warning');
            return false;
        }
        //  判断是否存在物料编码
        if (selectItem['ItemName']) {
            //判断单号中该物料未清量是否大于0
            const documentItem = this.documentList[documentIndex];
            if (documentItem['QTY_NC'] == 0) {
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

            // 获取库存接口，判断是否超库存
            this.getDataService.getSapStoreQty(obj).then((resp) => {
                    if (resp['Data']) {
                        if (BFlag === 'N') {
                            //  非批次、非序号管理，根据物料编码为唯一标识，物料收容数<=库存
                            this.successScan(documentIndex, obj, key, 0, 1);
                        } else {
                            // 当前标签收货数大于单据未清量
                            if (obj.QTY > selectItem['QTY_NC']) {
                                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否修改为未清量').then((res) => {
                                    if (res) {
                                        if (BFlag === 'B' && (this.BFlagObj[key] > resp['Data'])) {
                                            //  批次管理，根据批次号管理，同一批次号物料收容数>库存
                                            this.presentService.presentAlert('当前标签收货数大于库存，是否修改为库存量').then((kc) => {
                                                if (kc) {
                                                    // 修改为库存量
                                                    obj.QTY = resp['Data'] - this.BFlagObj[key];
                                                    const NC = Number(documentItem['Quantity']) - Number(documentItem['QTY_FIN']) - Number(resp['Data']);
                                                    const CUR = resp['Data'];
                                                    this.successScan(documentIndex, obj, key, NC, CUR);
                                                } else {
                                                    this.presentService.presentToast('当前物料扫描失败', 'warning');
                                                }
                                            });
                                        } else if (BFlag === 'S' && (obj.QTY > resp['Data'])) {
                                            //  序号管理，根据物料编码为唯一标识，物料收容数>库存
                                            this.presentService.presentAlert('当前标签收货数大于库存，是否修改为库存量').then((kc) => {
                                                if (kc) {
                                                    // 修改为库存量
                                                    obj.QTY = resp['Data'] - Number(documentItem['QTY_CUR']);
                                                    const NC = Number(documentItem['Quantity']) - Number(documentItem['QTY_FIN']) - Number(resp['Data']);
                                                    const CUR = resp['Data'];
                                                    this.successScan(documentIndex, obj, key, NC, CUR);
                                                } else {
                                                    this.presentService.presentToast('当前物料扫描失败', 'warning');
                                                }
                                            });
                                        }
                                        if (this.BFlagObj[key] > resp['Data']) {

                                        } else {
                                            // 修改为未清量
                                            obj.QTY = documentItem['QTY_NC'];
                                            const CUR = Number(documentItem['QTY_CUR']) + Number(obj.QTY);
                                            this.successScan(documentIndex, obj, key, 0, CUR);
                                        }
                                    } else {
                                        this.presentService.presentToast('当前物料扫描失败', 'warning');
                                    }
                                });
                            } else {
                                // 当前标签收货数小于单据未清量
                                const NC = Number(documentItem['QTY_NC']) - Number(obj.QTY);
                                const CUR = Number(documentItem['QTY_CUR']) + Number(obj.QTY);
                                this.successScan(documentIndex, obj, key, NC, CUR);
                            }
                        }
                    } else {
                        this.presentService.presentToast('当前物料库存不足', 'warning');
                    }
                }
            );
        } else {
            this.presentService.presentToast('当前单号不存在或已关闭', 'warning');
        }
    }

    successScan(documentIndex, obj, key, NC, CUR) {
        this.documentList[documentIndex]['QTY_NC'] = NC;
        this.documentList[documentIndex]['QTY_CUR'] = CUR;
        this.scanList.unshift(obj);
        this.scanNum = this.documentList[documentIndex]['QTY_CUR'];
        this.maxNum = obj.QTY;
        if (this.BFlagObj[key]) {
            this.BFlagObj[key] += Number(obj.QTY);
        } else {
            this.BFlagObj[key] = Number(obj.QTY);
        }
        this.presentService.presentToast('当前物料扫描成功');
    }

    changeQTY(event) {
        const row = this.scanList[0], value = event.target.value, oldNum = this.maxNum;
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

    disabledQTY() {
        let disable = false;
        if (!this.scanList[0] || !this.scanList[0]['QTY'] || this.scanList[0]['BFlag'] === 'S') {
            disable = true;
        }
        return disable;
    }
}
