import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';
import {Platform} from '@ionic/angular';

@Component({
    selector: 'app-dump-request',
    templateUrl: './dump-request.page.html'
})
export class DumpRequestPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanTypeArr = ['User', 'DocEntry'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        Bils_No: null,
        Cus_No: '',
        Whs: null,
        Wh_To: null,
        Kuwei: null,
        ToKuwei: null,
        remark: null,
    };
    BFlagObj = {};
    LineNumberList = [];
    materieObj: any = {};

    constructor(
        public presentService: PresentService,
        public publicService: PublicService,
        public dataService: DataService,
        public getDataService: GetDataService,
        public activatedRoute: ActivatedRoute,
        public pageRouterService: PageRouterService,
    ) {
        this.pageRouterService.getPageParams().then((res) => {
            if (res) {
                this.title = res['name'];
                this.infoObj.Bil_ID = res['id'];
            }
        });
        this.documentColumns = this.publicService.DocumentColumns;
        this.columns = this.publicService.TableColumns2;
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
        this.infoObj.Wh_To = null;
        this.infoObj.remark = null;
        this.documentList = [];
        this.scanList = [];
        this.materieObj = {};
    }

    submit() {
        // if (!this.infoObj.remark) {
        //     this.presentService.presentToast('请先扫描生产计划单', 'warning');
        // }
        this.infoObj.Cus_No = this.documentList[0].CardCode || '';
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
                OrderEntry: val.OrderEntry || '',
                OrderLine: val.OrderLine || '',
                NumPerMsr: val.NumPerMsr,
                // QUA_DocEntry: val.QUA_DocEntry,
                // QUA_LineNum: val.QUA_LineNum,
            });
        });
        const config = this.infoObj;
        config['LstDetail'] = LstDetail;
        config['remark'] = this.infoObj.remark;
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
                    this.infoObj.Wh_To = resp['Data'][0]['Wh_To'];
                    this.infoObj.Whs = resp['Data'][0]['Wh'];
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
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode'),
            BFlag = this.publicService.getArrInfo(arr, 'BFlag'),
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber'),
            key = ItemCodeText + DistNumber;
        let selectItem = {}, documentIndex = null;
        // 清空行号
        this.LineNumberList = [];

        // 序列号管理，只能存在一条数据
        if (BFlag === 'S' && this.BFlagObj[key]) {
            this.presentService.presentToast('e04', 'warning');
        }
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
                        this.addBarDetail(selectItem, documentIndex, BarcodeText, ItemCodeText, val, arr, key);
                    }
                });
            } else if (this.LineNumberList.length == 1) {
                // 只有一个物料编码的情况
                selectItem = this.LineNumberList[0];
                documentIndex = this.LineNumberList[0]['index'];
                this.addBarDetail(selectItem, documentIndex, BarcodeText, ItemCodeText, val, arr, key);
            } else {
                this.presentService.presentToast('e55', 'warning');
            }
        } else {
            return false;
        }
    }

    addBarDetail(selectItem, documentIndex, BarcodeText, ItemCodeText, val, arr, key) {
        const BFlag = this.publicService.getArrInfo(arr, 'BFlag');
        //  判断是否存在物料编码
        if (selectItem['ItemName']) {
            //判断单号中该物料未清量是否大于0
            const documentItem = this.documentList[documentIndex];
            if (selectItem['QTY_NC'] == 0) {
                this.presentService.presentToast('e04', 'warning');
                return;
            }
            const obj = {
                Bils_No: this.infoObj.Bils_No,
                Wh: this.infoObj.Whs,
                Wh_To: this.infoObj.Wh_To,
                Itm: selectItem['LineNum'],
                Barcode: BarcodeText,
                BarcodeText: val,
                ItemCode: ItemCodeText,
                ItemName: selectItem['ItemName'],
                QTY: Number(this.publicService.getArrInfo(arr, 'QTY')),
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

            // 获取库存接口，判断是否超库存
            if (selectItem['QTY_NC'] >= obj.QTY) {
                // 未清量大于物料收容
                // this.checkInventory(documentIndex, obj, BFlag, key);
                this.publicService.checkInventory(this.BFlagObj, selectItem, documentIndex, obj, BFlag, key).then((res) => {
                    if (res) {
                        this.successScan(res);
                    }
                });
            } else {
                // 未清量小于物料收容
                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否修改为未清量').then((wql) => {
                    if (wql) {
                        obj.QTY = this.documentList[documentIndex]['QTY_NC'];
                        this.publicService.checkInventory(this.BFlagObj, selectItem, documentIndex, obj, BFlag, key).then((res) => {
                            if (res) {
                                this.successScan(res);
                            }
                        });
                    } else {
                        this.presentService.presentToast('e14', 'warning');
                    }
                });
            }
        } else {
            this.presentService.presentToast('e10', 'warning');
        }
    }

    successScan(val, type?) {
        const documentIndex = val.dIndex, obj = val.Obj,
            key = val.Key, NC = val.N, CUR = val.C;
        this.documentList[documentIndex]['QTY_NC'] = NC < 0 ? 0 : NC;
        this.documentList[documentIndex]['QTY_CUR'] = CUR;
        this.scanNum = this.documentList[documentIndex]['QTY_CUR'];
        this.maxNum = obj.QTY;
        this.materieObj = obj;
        if (type) {
            //修改物料收容数
            const index = this.publicService.arrSameId(this.scanList, 'ItemCode', obj['ItemCode'], 'index');
            this.scanList[index]['QTY'] = obj.QTY;
            this.presentService.presentToast('e12');
        } else {
            //新增物料
            if (this.BFlagObj[key]) {
                this.BFlagObj[key] += Number(obj.QTY);
            } else {
                this.BFlagObj[key] = Number(obj.QTY);
            }
            this.scanList.unshift(obj);
            this.presentService.presentToast('e15');
        }
    }

    changeQTY(event, type?) {
        let row = {}, value: any = '', oldNum = 0;
        let item: any = {}, index: any = 0;
        if (type === 'row') {
            // 修改扫描页面row发料数量数据
            row = this.scanList[0];
            value = event.target.value;
            oldNum = this.maxNum;
            item = this.publicService.arrSameId(this.documentList, 'ItemCode', row['ItemCode']);
            index = this.publicService.arrSameId(this.documentList, 'ItemCode', row['ItemCode'], 'index');
        } else {
            // 修改表格数据
            row = event.row;
            value = event.event.target.value;
            oldNum = event.row['QTY'];
            item = this.publicService.arrSameId(this.documentList, 'ItemCode', row['ItemCode']);
            index = this.publicService.arrSameId(this.documentList, 'ItemCode', row['ItemCode'], 'index');
        }
        row['QTY'] = value;
        if (item) {
            const QTY_NC = Number(item['QTY_NC']) + Number(oldNum), key = row['ItemCode'] + row['BatchNo'];
            item['QTY_NC'] += Number(oldNum);
            item['QTY_CUR'] -= Number(oldNum);
            if (QTY_NC >= value) {
                // 未清量大于物料收容
                const BFlagObj = this.BFlagObj;
                BFlagObj[key] -= Number(oldNum);
                this.publicService.checkInventory(BFlagObj, item, index, row, row['BFlag'], key).then((res) => {
                    if (res) {
                        this.BFlagObj[key] = BFlagObj[key] + Number(res['Obj']['QTY']);
                        this.successScan(res, 'modify');
                    }
                });
            } else {
                // 未清量小于物料收容const
                const BFlagObj = this.BFlagObj;
                BFlagObj[key] -= Number(oldNum);
                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否修改为未清量').then((wql) => {
                    if (wql) {
                        row['QTY'] = item['QTY_NC'];
                        this.publicService.checkInventory(BFlagObj, item, index, row, row['BFlag'], key).then((res) => {
                            if (res) {
                                this.BFlagObj[key] = BFlagObj[key] + Number(res['Obj']['QTY']);
                                this.successScan(res, 'modify');
                            }
                        });
                    } else {
                        this.presentService.presentToast('e13', 'warning');
                    }
                });
            }
        }
    }
}
