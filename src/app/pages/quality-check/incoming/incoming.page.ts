import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';

@Component({
    selector: 'app-incoming',
    templateUrl: './incoming.page.html'
})
export class IncomingPage implements OnInit {
    title: string = '';
    documentList: any = [];
    scanTypeArr = ['User', 'DocEntry'];
    documentColumns = [];
    infoObj: any = {
        Bils_No: null,
        Bil_ID: null,
        User: null,
        isNumBils: false,
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
        this.documentColumns = this.publicService.Columns2;
    }

    ngOnInit() {
    }

    clearData() {
        this.documentList = [];
    }

    submit() {
        const LstDetail = [];
        this.documentList.forEach((val) => {
            if (val.SJQty) {
                LstDetail.push(val);
            }
        });
        if (!LstDetail.length) {
            this.presentService.presentToast('e53', 'warning');
        }
        const config = this.infoObj;
        config['LstDetail'] = LstDetail;
        this.getDataService.CGSJSubmitScanData(config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }

    getBillData() {
        const config = {
            order: this.infoObj.Bils_No,
            actType: this.infoObj.isNumBils ? 1 : 0
        };
        const request = this.dataService.getData('QC/GetCGSJBillData', config);
        request.subscribe(resp => {
            if (!resp['Data'].length) {
                this.presentService.presentToast('e02', 'warning');
            } else {
                resp.Data.forEach((val) => {
                    val.SJQty = val.SJQty || '';
                });
            }
            this.documentList = resp.Data;
        }, error => {
            this.presentService.presentToast(error.message);
        });
    }

}
