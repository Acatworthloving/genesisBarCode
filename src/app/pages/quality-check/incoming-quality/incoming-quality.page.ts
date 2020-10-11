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
        this.documentList.forEach((val) => {
            if (val.JSQty && val.ZJQty) {
                LstDetail.push(val);
            }
        });
        const config = this.infoObj;
        config['LstDetail'] = LstDetail;
        this.getDataService.CGZJSubmitScanData(config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }

    getBillData() {
        const config = {
            order: this.infoObj.Bils_No
        };
        const request = this.dataService.getData('QC/GetCGZJBillData', config);
        request.subscribe(resp => {
            this.documentList = resp.Data;
        }, error => {
            this.presentService.presentToast(error.message);
        });
    }
}
