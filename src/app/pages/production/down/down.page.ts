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
    templateUrl: './down.page.html'
})
export class DownPage implements OnInit {
    title: string = '';
    documentObj: any = {};
    scanTypeArr = ['User', 'DocEntry'];
    infoObj: any = {
        Bil_ID: null,
        User: null,
        Bils_No: null
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
            order: this.infoObj.Bils_No,
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
    }

    submit() {
        const config = {
            PlanCode: this.infoObj.Bils_No,
            PLineCode: this.documentObj.PLineCode,
            User: this.infoObj.User,
            ScanType: 'DOWN',
        };
        this.getDataService.submitPublicData('SCSCAN/ScanSubmitScanData', config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }
}
