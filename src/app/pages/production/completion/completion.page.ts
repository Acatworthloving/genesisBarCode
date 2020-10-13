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
    documentObj: any = {};
    scanTypeArr = ['User', 'PL'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        plcode: null,
        BGQty: 0,
    };
    documentColumns = [];

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
        this.documentColumns = this.publicService.Columns8;
    }

    ngOnInit() {
    }

    scanPL() {
        const config = {
            order: this.infoObj.plcode,
            actType: this.infoObj.Bil_ID
        };
        this.getDataService.getPublicData('SCSCAN/GetSCPlanData', config).then((resp) => {
            if (resp) {
                this.documentObj = resp['Data'];
            }
        });
    }


    clearData() {
        this.documentObj = {};
        this.infoObj['BGQty'] = 0;
    }

    submit() {
        const config = {
            PlanCode: this.infoObj.plcode,
            PLineCode: this.documentObj['PLineCode'],
            User: this.infoObj.User,
            BGQty: this.infoObj.BGQty,
        };
        this.getDataService.submitPublicData('SCSCAN/BGSubmitScanData', config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }
}