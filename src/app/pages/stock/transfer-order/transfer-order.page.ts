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
    templateUrl: './transfer-order.page.html'
})
export class TransferOrderPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    columns = [];
    scanList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanTypeArr = ['User', 'Whs'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        Bils_No: null,
        Cus_No: '',
        Whs: null,
        Wh_To: null,
        Kuwei: null,
        ToKuwei: null,
        remark: null
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
        this.scanList = [];
        this.materieObj = {};
    }

    submit() {
        if (!this.infoObj.Wh_To) {
            this.presentService.presentToast('请先扫描到仓库', 'warning');
            return;
        }
        const LstDetail = [];
        this.scanList.forEach((val) => {
            LstDetail.push({
                Bils_No: val.Bils_No,
                Wh: val.Wh,
                Wh_To: this.infoObj.Wh_To,
                Itm: '',
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
            });
        });
        const config = this.infoObj;
        // config['remark'] = this.infoObj.Bils_No;
        config['LstDetail'] = LstDetail;
        this.getDataService.SubmitScanData(config).then((resp) => {
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
            DistNumber = this.publicService.getArrInfo(arr, 'DistNumber'),
            key = ItemCodeText + DistNumber;
        let selectItem = {}, documentIndex = null;

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
            const obj = {
                Bils_No: null,
                Wh: this.infoObj.Whs,
                Wh_To: this.infoObj.Wh_To,
                Itm: '',
                Barcode: BarcodeText,
                BarcodeText: val,
                ItemCode: ItemCodeText,
                ItemName: '',
                QTY: Number(this.publicService.getArrInfo(arr, 'QTY')),
                BFlag: this.publicService.getArrInfo(arr, 'BFlag'),
                BatchNo: this.publicService.getArrInfo(arr, 'DistNumber'),
                LiuNo: this.publicService.getArrInfo(arr, 'LiuNo'),
                OrderEntry: '',
                OrderLine: '',
                NumPerMsr: '',
                QUA_DocEntry: 0,
                QUA_LineNum: 0,
                GGXH: '',
            };
            // 获取库存接口，判断是否超库存
            const config = {
                itemcode: obj.ItemCode,
                wh: obj.Wh,
                kw: this.infoObj.Kuwei || '',
                batNo: obj.BatchNo,
                batId: obj.BFlag,
            };
            this.getDataService.getSapStoreQty(config).then((resp) => {
                    if (resp['Data']) {
                        if (obj.QTY > resp['Data']) {
                            // 物料收容数>库存
                            this.presentService.presentAlert('当前标签收货数大于库存，是否修改为库存量').then((kc) => {
                                if (kc) {
                                    // 修改为库存量
                                    obj.QTY = resp['Data'];
                                    this.successScan(obj);
                                } else {
                                    this.presentService.presentToast('e14', 'warning');
                                }
                            });
                        } else {
                            // 修改为未清量
                            this.successScan(obj);
                        }
                    } else {
                        this.presentService.presentToast('e30', 'warning');
                    }
                }
            );
            // this.successScan(obj);
        } else {
            return false;
        }
    }

    successScan(obj) {
        this.materieObj = obj;
        this.scanList.unshift(obj);
        this.presentService.presentToast('e15');
    }
}
