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
    templateUrl: './completion.page.html'
})
export class CompletionPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanBFlagS: boolean = false;
    scanTypeArr = ['User', 'PL', 'WX', 'Whs'];
    infoObj: any = {
        Bil_ID: null,
        wxcode: null,
        ItemCode: null,
        User: '8',
        plcode: null,
        Cus_No: '',
        Whs: 'W01',
    };
    BFlagObj = {};
    LineNumberList = [];
    materieObj: any = {};
    wxList: any = [];

    constructor(
        public presentService: PresentService,
        public publicService: PublicService,
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
        this.infoObj.plcode = null;
        this.infoObj.wxcode = null;
        this.infoObj.ItemCode = null;
        this.infoObj.Cus_No = '';
        this.infoObj.Whs = null;
        this.documentList = [];
        this.scanList = [];
        this.wxList = [];
        this.materieObj = {};
    }

    submit() {
        const LstDetail = [];
        this.scanList.forEach((val) => {
            LstDetail.push({
                Bils_No: val.DocEntry,
                Wh: this.infoObj.Whs,
                Wh_To: val['Wh_To'],
                Itm: val['Itm'],
                Barcode: val['Barcode'] || val['BarCode'],
                BarcodeText: val['BarcodeText'],
                ItemCode: val.ItemCode,
                ItemName: val.ItemName,
                QTY: val.QTY,
                Kuwei: val.Kuwei,
                ToKuwei: val.ToKuwei,
                BFlag: val.BFlag,
                BatchNo: val.BatchNo,
                LiuNo: val.LiuNo,
                OrderEntry: val.OrderEntry,
                OrderLine: val.OrderLine,
                NumPerMsr: val.NumPerMsr
            });
        });
        const config = {
            Bil_ID: this.infoObj.Bil_ID,
            User: this.infoObj.User,
            Bils_No: this.documentList[0].DocNum,
            Cus_No: this.documentList[0].CardCode || '',
        };
        config['LstDetail'] = LstDetail;
        this.getDataService.submitPublicData('SC/SubmitScanData', config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }

    scanWX() {
        const hascode = this.wxList.indexOf(this.infoObj.wxcode);
        if (hascode < 0) {
            const item = this.publicService.arrSameId(this.documentList, 'ItemCode', this.infoObj.ItemCode);
            if (item['ItemCode']) {
                this.wxList.push(this.infoObj.wxcode);
                const config = {
                    wxcode: this.infoObj.wxcode,
                };
                this.getDataService.getPublicData('PXKB/GetWXItemCodeNum', config).then((resp) => {
                    if (resp) {
                        if (Number(resp['Data']) > Number(item['QTY_NC'])) {
                            //外箱数量大于未清量
                            this.presentService.presentToast('外箱拼箱数量大于未清量', 'warning');
                        } else {
                            //外箱数量小于未清量
                            this.getDataService.getPublicData('PXKB/GetWXBillData', config).then((res) => {
                                if (resp['Data'] && resp['Data'].length) {
                                    resp['Data'].forEach((val) => {
                                        this.scanList.push(val);
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                this.presentService.presentToast('当前外箱不在生产计划单中', 'warning');
            }
        } else {
            this.presentService.presentToast('当前外箱已扫描', 'warning');
        }
    }

    scanPL() {
        const config = {
            order: this.infoObj.plcode,
            actType: this.infoObj.Bil_ID,
        };
        this.getDataService.getPublicData('SC/GetBillData', config).then((resp) => {
            if (resp) {
                if (resp['Data'].length) {
                    resp['Data'].forEach((val) => {
                        val['QTY_NC'] = Number(val.Quantity) - Number(val.QTY_FIN);
                    });
                } else {
                    this.presentService.presentToast('当前单据已扫描完毕', 'warning');
                }
                this.documentList = resp['Data'];
            }
        });
    }

    scanInput(event) {
        this.addBar(event.value, event.arr);
    }

    addBar(val, arr) {
        if (!this.documentList.length) {
            this.presentService.presentToast('当前单据已扫描完毕', 'warning');
            return false;
        }
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode'),
            BFlag = this.publicService.getArrInfo(arr, 'BFlag'),
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber'),
            key = BFlag + DistNumber;
        let selectItem = {}, documentIndex = null;
        // 清空行号
        this.LineNumberList = [];

        // 序列号管理，只能存在一条数据
        if (BFlag === 'S' && this.BFlagObj[key]) {
            this.presentService.presentToast('当前物料已存在', 'warning');
        }
        // 判断是否扫描重复物料
        const scanItem = this.publicService.arrSameId(this.scanList, 'Barcode', BarcodeText);
        if (scanItem) {
            this.presentService.presentToast('当前物料已存在', 'warning');
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
                this.presentService.presentToast('当前物料扫描完毕', 'warning');
            }
        } else {
            return false;
        }
    }

    addBarDetail(selectItem, documentIndex, BarcodeText, ItemCodeText, val, arr, key) {
        const BFlag = this.publicService.getArrInfo(arr, 'BFlag');
        //  判断是否存在物料编码
        if (selectItem['ItemName']) {
            const obj = {
                Bils_No: this.infoObj.Bils_No,
                Wh: this.infoObj.Whs,
                Wh_To: '',
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
                OrderEntry: selectItem['OrderEntry'],
                OrderLine: selectItem['OrderLine'],
                NumPerMsr: selectItem['NumPerMsr'],
                DocNum: selectItem['DocNum'],
                DocEntry: selectItem['DocEntry'],
                QUA_DocEntry: 0,
                QUA_LineNum: 0,
                // QTYNumber: this.publicService.getArrInfo(arr, 'QTY'),
                GGXH: selectItem['GGXH'],
            };

            if (selectItem['QTY_NC'] >= obj.QTY) {
                // 未清量大于物料收容
                const returnObj = {
                    dIndex: documentIndex,
                    Obj: obj,
                    Key: key,
                    N: Number(selectItem['QTY_NC']) - Number(obj.QTY),
                    C: Number(selectItem['QTY_CUR']) + Number(obj.QTY)
                };
                this.successScan(returnObj);
            } else {
                // 未清量小于物料收容
                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否继续添加').then((res) => {
                    if (res) {
                        const returnObj = {
                            dIndex: documentIndex,
                            Obj: obj,
                            Key: key,
                            N: Number(selectItem['QTY_NC']) - Number(obj.QTY),
                            C: Number(selectItem['QTY_CUR']) + Number(obj.QTY)
                        };
                        this.successScan(returnObj);
                    } else {
                        this.presentService.presentToast('当前物料扫描失败', 'warning');
                    }
                });
            }
        } else {
            this.presentService.presentToast('当前单号不存在或已关闭', 'warning');
        }
    }

    // 成功添加/修改物料 type=true 修改
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
            this.presentService.presentToast('当前物料发料数修改成功');
        } else {
            //新增物料
            if (this.BFlagObj[key]) {
                this.BFlagObj[key] += Number(obj.QTY);
            } else {
                this.BFlagObj[key] = Number(obj.QTY);
            }
            this.scanList.unshift(obj);
            this.presentService.presentToast('当前物料扫描成功');
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
            const QTY_NC = Number(item['QTY_NC']) + Number(oldNum), key = row['BFlag'] + row['BatchNo'];
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
                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否继续修改').then((res) => {
                    if (res) {
                        this.publicService.checkInventory(BFlagObj, item, index, row, row['BFlag'], key).then((res) => {
                            if (res) {
                                this.BFlagObj[key] = BFlagObj[key] + Number(res['Obj']['QTY']);
                                this.successScan(res, 'modify');
                            }
                        });
                    } else {
                        this.presentService.presentToast('当前物料发料数修改失败', 'warning');
                    }
                });
            }
        }
    }
}
