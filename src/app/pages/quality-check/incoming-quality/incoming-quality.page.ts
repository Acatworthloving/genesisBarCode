import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';

@Component({
    selector: 'app-incoming-quality',
    templateUrl: './incoming-quality.page.html'
})
export class IncomingQualityPage implements OnInit {
    title: string = '';
    documentList: any = [];
    scanTypeArr = ['User', 'DocEntry'];
    documentColumns = [];
    infoObj: any = {
        Bils_No: null,
        Bil_ID: null,
        User: null,
    };

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
        this.documentColumns = this.publicService.Columns3;
    }

    ngOnInit() {
    }

    clearData() {
        this.documentList = [];
    }

    submit() {
        const LstDetail = [];
        for (const val of this.documentList) {
            const ZJQty = Number(val.ZJQty), JSQty = Number(val.JSQty), SJQty = Number(val.SJQty),
                BHGQty = Number(val.BHGQty), RejectQty = Number(val.RejectQty), Quantity = Number(val.Quantity);
            if (ZJQty > Quantity) {
                this.presentService.presentToast('质检数量不能大于待检数量', 'warning');
                return;
            }
            if (val.ZJType === '全检') {
                if (ZJQty != RejectQty + JSQty) {
                    this.presentService.presentToast('全检时,质检数量必须等于接收数量加拒收数量', 'warning');
                    return;
                }
            }
            if (BHGQty > ZJQty) {
                this.presentService.presentToast('不合格数量不能大于质检数量', 'warning');
                return;
            }
            if (val.JSType === '全收') {
                if (RejectQty || JSQty < ZJQty) {
                    this.presentService.presentToast('全收时,不能有拒收数量,接收数量不能小于质检数量', 'warning');
                    return;
                }
            }
            if (val.JSType === '退货') {
                if (JSQty) {
                    this.presentService.presentToast('退货时,不能有接收数量', 'warning');
                    return;
                }
            }
            LstDetail.push(val);
        }
        if (LstDetail.length) {
            const config = this.infoObj;
            config['LstDetail'] = LstDetail;
            this.getDataService.CGZJSubmitScanData(config).then((resp) => {
                if (resp) {
                    this.clearData();
                }
            });
        }
    }

    getBillData() {
        const config = {
            order: this.infoObj.Bils_No
        };
        const request = this.dataService.getData('QC/GetCGZJBillData', config);
        request.subscribe(resp => {
            if (!resp['Data'].length) {
                this.presentService.presentToast('e02', 'warning');
            }
            this.documentList = resp.Data;
        }, error => {
            this.presentService.presentToast(error.message);
        });
    }
}
