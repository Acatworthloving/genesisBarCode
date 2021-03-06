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
    templateUrl: './return.page.html'
})
export class ReturnPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanBFlagS: boolean = false;
    scanTypeArr = ['User', 'DocEntry', 'Whs'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        Bils_No: null,
        Cus_No: '',
        Whs: null,
        remark: null
    };
    BFlagObj = {};
    remarkObj = {};
    LineNumberList = [];
    materieObj: any = {};

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
        this.columns = this.publicService.TableColumns4;
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
        this.infoObj.remark = null;
        this.documentList = [];
        this.scanList = [];
        this.materieObj = {};
    }

    submit() {
        if (!this.infoObj['Whs']) {
            this.presentService.presentToast('e39', 'warning');
            return false;
        }
        const LstDetail = [];
        this.scanList.forEach((val) => {
            LstDetail.push({
                Bils_No: val.DocEntry,
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
                OrderEntry: val.OrderEntry,
                OrderLine: val.OrderLine,
                NumPerMsr: val.NumPerMsr,
                remark: val.remark
            });
        });
        const config = {
            Bil_ID: this.infoObj.Bil_ID,
            User: this.infoObj.User,
            Bils_No: this.documentList[0].DocNum,
            Cus_No: this.documentList[0].CardCode || '',
            // remark: this.infoObj.remark,
        };
        config['LstDetail'] = LstDetail;
        this.getDataService.submitPublicData('SC/SubmitScanData', config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }

    scanPL() {
        const config = {
            order: this.infoObj.Bils_No,
            actType: this.infoObj.Bil_ID,
        };
        this.getDataService.getPublicData('SC/GetBillData', config).then((resp) => {
            if (resp) {
                if (resp['Data'].length) {
                    resp['Data'].forEach((val) => {
                        const num = Number(val.Quantity) - Number(val.QTY_FIN);
                        val['QTY_NC'] = num < 0 ? 0 : num;
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
            const remarkkey = selectItem['LineNum'] + '&' + ItemCodeText;
            console.log('addBarDetail', remarkkey);
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
                OrderEntry: selectItem['OrderEntry'] || '',
                OrderLine: selectItem['OrderLine'] || '',
                NumPerMsr: selectItem['NumPerMsr'],
                DocNum: selectItem['DocNum'],
                DocEntry: selectItem['DocEntry'],
                QUA_DocEntry: 0,
                QUA_LineNum: 0,
                remark: this.remarkObj[remarkkey] || '',
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
                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否继续添加').then((wql) => {
                    if (wql) {
                        const returnObj = {
                            dIndex: documentIndex,
                            Obj: obj,
                            Key: key,
                            N: Number(selectItem['QTY_NC']) - Number(obj.QTY),
                            C: Number(selectItem['QTY_CUR']) + Number(obj.QTY)
                        };
                        this.successScan(returnObj);
                    } else {
                        this.presentService.presentToast('e14', 'warning');
                    }
                });
            }
        } else {
            this.presentService.presentToast('e10', 'warning');
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
        const remarkkey = obj['Itm'] + '&' + obj['ItemCode'];
        this.remarkObj[remarkkey] = obj['remark'];
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
                const returnObj = {
                    dIndex: index,
                    Obj: row,
                    Key: key,
                    N: Number(item['QTY_NC']) - Number(row['QTY']),
                    C: Number(item['QTY_CUR']) + Number(row['QTY'])
                };
                this.successScan(returnObj, 'modify');
            } else {
                // 未清量小于物料收容const
                const BFlagObj = this.BFlagObj;
                BFlagObj[key] -= Number(oldNum);
                this.presentService.presentAlert('当前标签收货数大于单据未清量，是否继续修改').then((wql) => {
                    if (wql) {
                        const returnObj = {
                            dIndex: index,
                            Obj: row,
                            Key: key,
                            N: 0,
                            C: Number(item['QTY_CUR']) + Number(row['QTY'])
                        };
                        this.successScan(returnObj, 'modify');
                    } else {
                        this.presentService.presentToast('当前物料发料数修改失败', 'warning');
                    }
                });
            }
        }
    }

    changeRemark(event, type?) {
        let obj = {}, remark = '';
        if (type === 'row') {
            obj = this.scanList[0];
            remark = event.detail.value;
        } else {
            obj = event;
            remark = event['remark'];
        }
        const remarkkey = obj['Itm'] + '&' + obj['ItemCode'];
        console.log('changeRemark', remarkkey);
        this.remarkObj[remarkkey] = remark;
    }
}
