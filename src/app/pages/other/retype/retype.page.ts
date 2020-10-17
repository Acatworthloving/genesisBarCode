import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';
import {ScanInputPage} from '../../component/scan-input/scan-input.page';

@Component({
    selector: 'app-receiving',
    templateUrl: './retype.page.html'
})
export class RetypePage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanTypeArr = ['User'];
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
    @ViewChild('scanInputView', {static: false}) InputView: ScanInputPage;

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
        this.columns = this.publicService.Columns11;
    }

    ngOnInit() {
    }


    clearData() {
        this.scanList = [];
    }

    submit() {
        const LstDetail = [];
        this.scanList.forEach((val) => {
            if (val.QTY && val.NUM && val.PRINTER) {
                LstDetail.push({
                    Barcode: val.Barcode,
                    QTY: val.QTY,
                    NUM: val.NUM,
                    User: this.infoObj.User,
                    PRINTER: val.PRINTER
                });
            }
        });
        if (LstDetail.length) {
            this.getDataService.submitPublicData('Print/AddRePrintData', LstDetail).then((resp) => {
                if (resp) {
                    this.clearData();
                }
            });
        }
    }

    scanInput(event) {
        this.addBar(event.value, event.arr);
    }

    addBar(val, arr) {
        const ItemCodeText: any = this.publicService.getArrInfo(arr, 'ItemCode'),
            QTYText: any = this.publicService.getArrInfo(arr, 'QTY'),
            BarcodeText: any = this.publicService.getArrInfo(arr, 'Barcode');
        // 判断是否扫描重复物料
        const scanItem = this.publicService.arrSameId(this.scanList, 'Barcode', BarcodeText);
        if (scanItem) {
            this.presentService.presentToast('当前物料已存在', 'warning');
            return false;
        }
        //  判断是否存在物料编码
        if (ItemCodeText) {
            this.presentService.presentAlertBaseInput().then((res) => {
                this.InputView.selected();
                let num = 0;
                if (res) {
                    console.log(res, res['NUM']);
                    num = res['NUM'];
                }
                this.scanList.push({
                    ItemCode: ItemCodeText,
                    Barcode: BarcodeText,
                    QTY: QTYText,
                    NUM: num,
                    PRINTER: null
                });
            });

        }
    }
}
