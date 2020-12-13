import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {DataService} from '../../../api/data.service';
import {GetDataService} from '../../../providers/get-data.service';
import {AlertController, NavController, Platform} from '@ionic/angular';
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
    columns2 = [];
    scanList: any = [];
    documentList: any = [];
    documentTwoList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanTypeArr = ['User', 'Whs'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        Bils_No: null,
        Cus_No: '',
        Whs: null,
        wxcode: null,
        ItemCode: null,
        PDType: ''
    };
    BFlagObj = {};
    materieObj: any = {};
    NColumns = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '库存数量',
            prop: 'QTY',
        },
        // {
        //     name: '物料名称',
        //     prop: 'ItemName',
        // },
        // {
        //     name: '规格型号',
        //     prop: 'GGXH',
        // },
        // {
        //     name: '仓库',
        //     prop: 'WH',
        // },
    ];

    BColumns = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '批次/序列号',
            prop: 'BatNo',
        },
        {
            name: '库存数量',
            prop: 'QTY',
        },
        // {
        //     name: '物料名称',
        //     prop: 'ItemName',
        // },
        // {
        //     name: '规格型号',
        //     prop: 'GGXH',
        // },
        // {
        //     name: '仓库',
        //     prop: 'WH',
        // },
    ];

    SColumns = [
        // {
        //     name: '物料编码',
        //     prop: 'ItemCode',
        // },
        {
            name: '序列号',
            prop: 'BatNo',
        },
        {
            name: '库存数量',
            prop: 'QTY',
        },
        // {
        //     name: '物料名称',
        //     prop: 'ItemName',
        // },
        // {
        //     name: '规格型号',
        //     prop: 'GGXH',
        // },
        // {
        //     name: '仓库',
        //     prop: 'WH',
        // },
    ];


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
        this.columns2 = this.BColumns;
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
        // this.infoObj.Whs = null;
        this.infoObj.Wh_To = null;
        this.infoObj.wxcode = null;
        this.infoObj.ItemCode = null;
        this.infoObj.PDType = '';
        this.scanList = [];
        this.materieObj = {};
    }

    changePD(event) {
        if (event === '非批次盘点') {
            this.columns2 = this.NColumns;
        } else if (event === '序列号盘点') {
            this.columns2 = this.SColumns;
        } else {
            this.columns2 = this.BColumns;
        }

        this.getBillData(event);
    }

    getBillData(type) {
        const config = {
            pdType: type
        };
        this.getDataService.getPublicData('PD/GetBillData', config).then((res) => {
            if (res) {
                this.documentList = res['Data'];
                const arr = JSON.stringify(res['Data']);
                this.documentTwoList = JSON.parse(arr);
            }
        });
    }

    submit() {
        if (this.scanList.length) {
            //存在新扫描记录
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
                    WH: val.WH,
                    BatNo: val.BatNo,
                    BFlag: val.BFlag
                });
            });
            this.getDataService.SubmitAddPD(LstDetail).then((resp) => {
                if (resp) {
                    if (this.documentTwoList.length) {
                        this.SubmitScanData();
                    } else {
                        this.presentService.presentToast(resp['ErrMsg']);
                        this.clearData();
                    }
                }
            });
        } else {
            // 没有扫描新物料
            if (this.documentTwoList.length) {
                this.SubmitScanData();
            } else {
                this.presentService.presentToast('e54', 'warning');
            }
        }
    }

    // 修改盘点数据提交
    SubmitScanData(type?) {
        const ListDetail = [];
        this.documentTwoList.forEach((val) => {
            const item = this.publicService.arrSameId(this.documentList, 'BarCode', val.BarCode);
            if (!item) {
                // 如果删除某条数据
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
                    // 如果删除某条数据
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
        if (ListDetail.length) {
            this.getDataService.SubmitModifyPD(ListDetail).then((resp) => {
                if (resp) {
                    this.clearData();
                    this.presentService.presentToast('盘点数据提交成功');
                }
            });
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
        if (event.arr) {
            this.addBar(event.value, event.arr);
        } else {
            if (this.infoObj.PDType === '序列号盘点') {
                const obj = {
                    DocEntry: 0,
                    LineId: 0,
                    BarCode: event.value,
                    ItemCode: '',
                    ItemName: '',
                    QTY: 1,
                    BatNo: event.value,
                    BFlag: 'S',
                    WH: this.infoObj.Whs
                };
                if (obj) {
                    this.successScan(obj);
                }
            } else {
                this.presentService.presentToast('e32', 'danger');
            }
        }
    }

    addBar(val, arr) {
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode'),
            BFlagText = this.publicService.getArrInfo(arr, 'BFlag'),
            QtyText = this.publicService.getArrInfo(arr, 'QTY'),
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber');

        //  判断是否存在物料编码
        if (ItemCodeText) {
            let obj: any;
            if (this.infoObj.PDType === '非批次盘点') {
                if (BFlagText === 'N') {
                    obj = {
                        DocEntry: 0,
                        LineId: 0,
                        BarCode: BarcodeText,
                        ItemCode: ItemCodeText,
                        ItemName: '',
                        QTY: QtyText,
                        BatNo: '',
                        BFlag: BFlagText,
                        WH: this.infoObj.Whs,
                    };
                } else {
                    this.presentService.presentToast('只能扫描非批次序列号管理标签', 'warning');
                    return false;
                }
            }
            if (this.infoObj.PDType === '批次盘点') {
                if (BFlagText === 'B') {
                    obj = {
                        DocEntry: 0,
                        LineId: 0,
                        BarCode: BarcodeText,
                        ItemCode: ItemCodeText,
                        ItemName: '',
                        QTY: QtyText,
                        BatNo: DistNumber,
                        BFlag: BFlagText,
                        WH: this.infoObj.Whs,
                    };
                } else {
                    this.presentService.presentToast('只能扫描批次号管理标签', 'warning');
                    return false;
                }
            }

            if (obj) {
                this.successScan(obj);
            } else {
                this.presentService.presentToast('e32', 'danger');
            }
        } else {
            return false;
        }
    }

    successScan(obj) {
        this.materieObj = obj;
        this.scanList.unshift(obj);
        this.presentService.presentToast('e15');
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

    // ionViewWillLeave() {
    //     this.publicService.unsubBackPage();
    // }
}
