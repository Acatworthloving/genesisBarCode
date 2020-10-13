import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';

@Component({
    selector: 'app-alarm',
    templateUrl: './disarmed.page.html'
})
export class DisarmedPage implements OnInit {
    title: string = '';
    pageType: string = 'getOrder';
    documentColumns = [];
    columns = [];
    documentList: any = [];
    scanList: any = [];
    scanNum: number = 0;
    maxNum: number = 0;
    scanTypeArr = ['User', 'PL'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        plcode: null
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
        this.documentColumns = this.publicService.Columns9;
        this.columns = this.publicService.TableColumns;
    }

    ngOnInit() {
    }

    scanPL() {
        const config = {
            plineCode: this.infoObj.plcode
        };
        this.getDataService.getPublicData('Warn/GetWarnBillData', config).then((resp) => {
            if (resp) {
                for (const item of resp['Data']) {
                    item['State'] = '否';
                }
                this.documentList = resp['Data'];
            }
        });
    }

    clearData() {
        this.infoObj.plcode = null;
        this.documentList = [];
    }

    submit() {
        const LstDetail = [];
        this.documentList.forEach((val) => {
            if (val['State'] === '是' && val.FaultReason) {
                LstDetail.push({
                    User: this.infoObj.User,
                    PLineCode: this.infoObj.plcode,
                    FaultType: val.FaultType,
                    DocEntry: val.DocEntry,
                    FaultProblem: val.FaultProblem,
                    FaultReason: val.FaultReason,
                    State: 'Y'
                });
            }
        });
        if (LstDetail.length) {
            this.getDataService.submitPublicData('Warn/RemoveWarnScanData', LstDetail).then((resp) => {
                if (resp) {
                    this.clearData();
                }
            });
        } else {
            this.presentService.presentToast('请完善信息再提交', 'warning');
        }
    }
}
